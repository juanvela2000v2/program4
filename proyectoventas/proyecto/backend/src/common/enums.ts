export enum Role {
  User = 'user',
  Seller = 'seller',
  Support = 'support',
  Admin = 'admin',
}

export enum ListingStatus {
  Draft = 'draft',
  PendingReview = 'pending_review',
  Published = 'published',
  Rejected = 'rejected',
  Sold = 'sold',
  Archived = 'archived',
}

export enum ListingType {
  Job = 'job',
  RealEstateSale = 'real_estate_sale',
  Rent = 'rent',
  Anticretico = 'anticretico',
  Product = 'product',
  Service = 'service',
}

export enum PaymentStatus {
  Pending = 'pending',
  Paid = 'paid',
  Rejected = 'rejected',
}
