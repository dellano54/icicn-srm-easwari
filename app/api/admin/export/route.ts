import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import * as XLSX from 'xlsx';

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  // Fetch all data
  const users = await prisma.user.findMany({
    include: {
      paper: true,
      members: true
    },
    orderBy: { createdAt: 'desc' }
  });

  const papers = await prisma.paper.findMany({
    include: {
      user: true,
      reviews: true
    }
  });

  // --- Helpers ---
  const formatDate = (date: Date) => date.toISOString().split('T')[0];

  // 1. Teams Sheet (Matches "Teams" Tab)
  const teamsData = users.map(user => ({
    'Team ID': user.password, // Visible ID
    'Team Name': user.teamName,
    'Lead Name': user.members.find(m => m.isLead)?.name || 'N/A',
    'Lead Email': user.email,
    'Mentor': user.mentorName,
    'Department': user.mentorDept,
    'Country': user.country,
    'Mode': user.mode,
    'Members Count': user.members.length,
    'Current Status': user.paper?.status || 'No Paper'
  }));

  // 2. Payments History Sheet (Matches "History" Tab - Verified Payments)
  const paymentsData = papers
    .filter(p => p.status === 'REGISTERED')
    .map(p => ({
      'Team Name': p.user.teamName,
      'Payer Name': p.paymentSenderName || 'N/A',
      'Transaction Date': formatDate(p.updatedAt),
      'Amount': p.user.country.toLowerCase() === 'india' ? '₹8000' : '$300',
      'Status': 'Verified'
    }));

  // 3. Accepted Papers Sheet (Matches "Accepted" Tab)
  const acceptedData = papers
    .filter(p => ['ACCEPTED_UNPAID', 'REGISTERED'].includes(p.status))
    .map(p => ({
      'Paper ID': p.id.split('-').pop(),
      'Team Name': p.user.teamName,
      'Domains': p.domains.join(', '),
      'Tier': p.adminTier || 'N/A',
      'Payment Status': p.status === 'REGISTERED' ? 'Paid' : 'Unpaid'
    }));

  // 4. Rejected Papers Sheet (Matches "Rejected" Tab)
  const rejectedData = papers
    .filter(p => p.status === 'REJECTED')
    .map(p => ({
      'Paper ID': p.id.split('-').pop(),
      'Team Name': p.user.teamName,
      'Domains': p.domains.join(', '),
      'Rejection Date': formatDate(p.updatedAt)
    }));

  // 5. Pending Decisions Sheet (Matches "Overview > Pending")
  const pendingDecisionsData = papers
    .filter(p => p.status === 'AWAITING_DECISION')
    .map(p => {
        const acceptCount = p.reviews.filter(r => r.decision === 'ACCEPT').length;
        const rejectCount = p.reviews.filter(r => r.decision === 'REJECT').length;
        return {
            'Paper ID': p.id.split('-').pop(),
            'Team Name': p.user.teamName,
            'Domains': p.domains.join(', '),
            'Accepts': acceptCount,
            'Rejects': rejectCount,
            'Submission Date': formatDate(p.createdAt)
        };
    });

  // 6. Pending Payments Sheet (Matches "Overview > Payment Verification")
  const pendingPaymentsData = papers
    .filter(p => p.status === 'PAYMENT_VERIFICATION')
    .map(p => ({
      'Team Name': p.user.teamName,
      'Payer Name': p.paymentSenderName || 'N/A',
      'Proof Uploaded': 'Yes',
      'Upload Date': formatDate(p.updatedAt)
    }));

  // 7. All Members Sheet (Extra Utility)
  const membersData = users.flatMap(user => 
    user.members.map(member => ({
        'Team Name': user.teamName,
        'Name': member.name,
        'Role': member.isLead ? 'Lead' : 'Member',
        'Email': member.email,
        'Phone': member.phone,
        'College': member.college,
        'City': member.city
    }))
  );

  // --- Build Workbook ---
  const wb = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(teamsData), "Teams");
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(paymentsData), "Payments History");
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(acceptedData), "Accepted Papers");
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(rejectedData), "Rejected Papers");
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(pendingDecisionsData), "Pending Decisions");
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(pendingPaymentsData), "Pending Payments");
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(membersData), "All Members");

  // Generate Buffer
  const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

  return new NextResponse(buf, {
    status: 200,
    headers: {
      'Content-Disposition': `attachment; filename="iccicn_dashboard_export_${formatDate(new Date())}.xlsx"`,
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    },
  });
}
