import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const allowCors = (res: NextResponse) => {
  res.headers.set("Access-Control-Allow-Origin", "*"); 
  res.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return res;
};


export async function OPTIONS() {
  const res = NextResponse.json({}, { status: 200 });
  return allowCors(res);
}

export async function POST(
  req: NextRequest,
  { params }: { params: { template: string } }
) {
  const authHeader = req.headers.get('authorization');
  const expectedToken = `Bearer ${process.env.EMAIL_SECRET}`;

  const { to, subject, variables } = await req.json();
  const { template } = params;

  const filePath = path.join(process.cwd(), 'email-templates', `${template}.html`);
  
  if (!fs.existsSync(filePath)) {
    const res = NextResponse.json({ success: false, error: `Template "${template}" not found.` }, { status: 404 });
    return allowCors(res);
  }

  try {
    let templateContent = fs.readFileSync(filePath, 'utf-8');

    
    for (const key in variables) {
      const regex = new RegExp(`{{{${key}}}}`, 'g');
      templateContent = templateContent.replace(regex, variables[key]);
    }

    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"OrangeTrace" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: templateContent,
    });

    const res = NextResponse.json({ success: true });
    return allowCors(res);
  } catch (err: any) {
    console.error('[EMAIL ERROR]:', err);
    const res = NextResponse.json({ success: false, error: err.message }, { status: 500 });
    return allowCors(res);
  }
}
