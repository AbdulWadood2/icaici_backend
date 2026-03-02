import { Body, Controller, Post, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiBody, ApiOperation } from '@nestjs/swagger';
import { memoryStorage } from 'multer';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { ReviewerService } from './reviewer.service';
import { ApplyReviewerDto } from './dto/apply-reviewer.dto';

function fileFilter(
  _req: Express.Request,
  file: Express.Multer.File,
  cb: (err: Error | null, acceptFile: boolean) => void,
) {
  const allowed = ['application/pdf'];
  if (file.mimetype && allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new BadRequestException('Only PDF files are allowed for CV') as unknown as Error, false);
  }
}

@Controller('reviewers')
export class ReviewerController {
  constructor(private readonly reviewerService: ReviewerService) {}

  @ApiOperation({ summary: 'Submit reviewer application (public)' })
  @Post('apply')
  @UseInterceptors(
    FileInterceptor('cvFile', {
      storage: memoryStorage(), // no disk write – file kept in memory and sent as email attachment only
      fileFilter,
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['fullName', 'email', 'affiliation', 'country', 'qualification', 'keywords', 'linkedIn', 'paperCapacity', 'confidentiality', 'cvFile'],
      properties: {
        fullName: { type: 'string' },
        email: { type: 'string', format: 'email' },
        affiliation: { type: 'string' },
        country: { type: 'string' },
        qualification: { type: 'string', enum: ['Master', 'PhD'] },
        keywords: { type: 'string' },
        linkedIn: { type: 'string', format: 'uri' },
        paperCapacity: { type: 'string', enum: ['2-3', '4-6', '6-8'] },
        confidentiality: { type: 'boolean' },
        cvFile: { type: 'string', format: 'binary' },
      },
    },
  })
  async apply(
    @Body() body: Record<string, unknown>,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const linkedIn = (body.linkedIn as string) || (body.LinkedIn as string);
    const confidentiality = body.confidentiality === true
      || body.confidentiality === 'true'
      || body.confidentiality === 'on';
    const dto = plainToInstance(ApplyReviewerDto, {
      fullName: String(body.fullName ?? ''),
      email: String(body.email ?? ''),
      affiliation: String(body.affiliation ?? ''),
      country: String(body.country ?? ''),
      qualification: String(body.qualification ?? ''),
      keywords: String(body.keywords ?? ''),
      linkedIn: linkedIn ? String(linkedIn) : '',
      paperCapacity: String(body.paperCapacity ?? ''),
      confidentiality: Boolean(confidentiality),
    });
    const errors = await validate(dto);
    if (errors.length > 0) {
      const messages = errors.flatMap((e) => Object.values(e.constraints || {}));
      throw new BadRequestException(messages.length ? messages : 'Validation failed');
    }
    if (!file?.buffer) {
      throw new BadRequestException('CV file (PDF) is required');
    }
    const result = await this.reviewerService.apply(dto, file.buffer, file.originalname || 'cv.pdf');
    return { data: result };
  }
}
