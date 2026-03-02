import { ReviewerApplication } from '../entities/reviewer-application.entity';

export interface IReviewerHelper {
  create(data: Partial<ReviewerApplication>): Promise<ReviewerApplication>;
}
