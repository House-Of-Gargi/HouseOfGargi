import { NextResponse } from 'next/server';
import { proxyToBackend } from '@/lib/apiProxy';

export async function GET(req: Request) {
  try {
    const res = await proxyToBackend(req, '/api/v1/admin/applications');
    const data = await res.json().catch(() => ({}));

    if (res.ok && Array.isArray(data.applications)) {
      const { searchParams } = new URL(req.url);
      const statusFilter = searchParams.get('status');

      let list = data.applications.map((d: any) => ({
        ...d,
        applicationId: d.application_number || d.id || d.applicationId,
        submittedAt: d.created_at || d.submittedAt,
        typeOfArt: d.type_of_art || d.typeOfArt,
        reviewNotes: d.review_notes || d.reviewNotes,
      }));

      if (statusFilter && statusFilter !== 'all') {
        list = list.filter((a: any) => a.status === statusFilter);
      }

      return NextResponse.json({
        success: true,
        count: list.length,
        applications: list,
      });
    }

    return NextResponse.json(data, { status: res.status });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err?.message || 'Error proxying applications' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const id = body.applicationId || body.id;
    const status =
      body.status ||
      (body.action === 'approve' ? 'approved' : body.action === 'reject' ? 'rejected' : 'pending');

    if (!id) {
      return NextResponse.json({ success: false, message: 'Application ID required' }, { status: 400 });
    }

    return proxyToBackend(req, `/api/v1/admin/applications/${id}/status`, {
      method: 'PATCH',
      body: {
        status,
        reviewNotes: body.reviewNotes,
        adminEmail: body.adminEmail,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err?.message || 'Error processing application status' },
      { status: 400 }
    );
  }
}
