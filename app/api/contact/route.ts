import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import { adminDb } from "@/lib/firebase-admin"; 
import { Timestamp } from "firebase-admin/firestore"; 
import { format } from "date-fns-tz"; 

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json();

    
    const submissionRef = adminDb.collection("contactSubmissions");
    const now = new Date();
    const serverTimestamp = Timestamp.fromDate(now); 
    const istDateString = format(now, "dd-MM-yyyy HH:mm:ss", { timeZone: "Asia/Kolkata" }); 

    await submissionRef.add({
      name,
      email,
      message,
      createdAt: serverTimestamp,
      createdAtIST: istDateString,
    });

    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASS,
      },
    });
    
    const templatePath = path.resolve(process.cwd(), "email-templates/contact-confirmation.html");
    let confirmationHtml = fs.readFileSync(templatePath, "utf8");
    confirmationHtml = confirmationHtml.replace("{{name}}", name);

    let mailToUserOptions = {
        from: '"OrangeTrace" <orangetrace.official@gmail.com>',
        to: email,
        subject: "We've Received Your Message | OrangeTrace",
        html: confirmationHtml,
    };

    await transporter.sendMail(mailToUserOptions);

    return NextResponse.json(
      { message: "Submission successful" }, 
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to process submission" }, 
      { status: 500 }
    );
  }
}