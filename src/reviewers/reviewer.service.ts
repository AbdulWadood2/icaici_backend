import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { MailService } from 'src/mail/mail.service';
import type { IReviewerHelper } from './interface/reviewer.helper.interface';
import type { IConferenceHelper } from 'src/conference/interface/conference.helper.interface';
import { ApplyReviewerDto } from './dto/apply-reviewer.dto';

@Injectable()
export class ReviewerService {
  constructor(
    @Inject('IReviewerHelper')
    private readonly reviewerHelper: IReviewerHelper,
    @Inject('IConferenceHelper')
    private readonly conferenceHelper: IConferenceHelper,
    private readonly mailService: MailService,
  ) {}

  async apply(dto: ApplyReviewerDto, cvBuffer: Buffer, cvFilename: string): Promise<{ message: string }> {
    if (!cvBuffer?.length) {
      throw new BadRequestException('CV file is required (PDF)');
    }
    await this.reviewerHelper.create({
      fullName: dto.fullName,
      email: dto.email,
      affiliation: dto.affiliation,
      country: dto.country,
      qualification: dto.qualification,
      keywords: dto.keywords,
      linkedIn: dto.linkedIn,
      paperCapacity: dto.paperCapacity,
      confidentiality: dto.confidentiality,
    });

    const conference = await this.conferenceHelper.findOne();
    const toEmail = conference?.conferenceEmail || process.env.MAIL_FROM || process.env.SMTP_USER;
    const siteTitle = conference?.siteTitle || conference?.shortName || 'Conference';

    if (toEmail && this.mailService.isConfigured()) {
      const subject = `[${siteTitle}] New Reviewer Application: ${dto.fullName}`;
      const html = `
        <h2>New Reviewer Application</h2>
        <p><strong>Name:</strong> ${dto.fullName}</p>
        <p><strong>Email:</strong> ${dto.email}</p>
        <p><strong>Affiliation:</strong> ${dto.affiliation}</p>
        <p><strong>Country:</strong> ${dto.country}</p>
        <p><strong>Qualification:</strong> ${dto.qualification}</p>
        <p><strong>Expertise:</strong> ${dto.keywords}</p>
        <p><strong>LinkedIn:</strong> <a href="${dto.linkedIn}">${dto.linkedIn}</a></p>
        <p><strong>Paper capacity:</strong> ${dto.paperCapacity}</p>
        <p><strong>Confidentiality agreed:</strong> ${dto.confidentiality ? 'Yes' : 'No'}</p>
        <p>CV is attached to this email.</p>
      `;
      const text = `New Reviewer Application from ${dto.fullName} (${dto.email}). Affiliation: ${dto.affiliation}. Country: ${dto.country}. Qualification: ${dto.qualification}. CV attached.`;
      const safeName = cvFilename && /\.pdf$/i.test(cvFilename) ? cvFilename : `${cvFilename || 'cv'}.pdf`;
      await this.mailService.send({
        to: toEmail,
        subject,
        text,
        html,
        attachments: [{ filename: safeName, content: cvBuffer }],
      });
    }

    if (this.mailService.isConfigured() && dto.email) {
      const subject = `Reviewer Application Received – ${siteTitle}`;
      const html = `
        <p>Dear ${dto.fullName},</p>
        <p>Thank you for applying to become a reviewer for ${siteTitle}.</p>
        <p>We have received your application and will get back to you after review.</p>
        <p>Best regards,<br/>${siteTitle} Team</p>
      `;
      await this.mailService.send({
        to: dto.email,
        subject,
        html,
      });
    }

    return { message: 'Application submitted successfully. We will contact you after review.' };
  }
}
