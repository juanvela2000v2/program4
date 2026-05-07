import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { ListingStatus, Role } from '../../common/enums';
import { ModerationService } from '../moderation/moderation.service';
import { UsersService } from '../users/users.service';
import { CreateListingDto, SearchListingsDto } from './dto';
import { Listing } from './listing.entity';

@Injectable()
export class ListingsService {
  constructor(
    @InjectRepository(Listing) private readonly listings: Repository<Listing>,
    private readonly moderation: ModerationService,
    private readonly users: UsersService,
  ) {}

  async create(ownerId: string, dto: CreateListingDto) {
    try {
      console.log('ListingsService.create payload:', { ownerId, dto });
      const check = await this.moderation.checkListing(dto.title, dto.description);
      const status = check.approved ? ListingStatus.Published : ListingStatus.Rejected;
      const owner = await this.users.findById(ownerId);
      const contactName = dto.contactName?.trim() || dto.name?.trim() || owner?.name || '';
      const contactPhone = dto.contactPhone?.trim() || dto.phone?.trim() || '';
      const created = this.listings.create({
        ...dto,
        contactName,
        contactPhone,
        ownerId,
        status,
        moderation: check,
      });
      return await this.listings.save(created);
    } catch (err) {
      console.error('ListingsService.create error:', err);
      throw err;
    }
  }

  search(query: SearchListingsDto) {
    const where: Record<string, unknown> = { status: ListingStatus.Published };
    if (query.type) where.type = query.type;
    if (query.q) where.title = ILike(`%${query.q}%`);
    return this.listings.find({ where, order: { createdAt: 'DESC' }, take: 60 });
  }

  findAllForAdmin() {
    return this.listings.find({ order: { createdAt: 'DESC' }, take: 120 });
  }

  async updateStatus(user: { roles?: string[] }, id: string, status: ListingStatus) {
    if (!user.roles?.includes(Role.Admin)) throw new ForbiddenException('Solo admin puede cambiar estados');
    const listing = await this.listings.findOne({ where: { id } });
    if (!listing) throw new NotFoundException('Aviso no encontrado');
    listing.status = status;
    return this.listings.save(listing);
  }

  async update(ownerId: string, id: string, dto: Partial<CreateListingDto>) {
    try {
      const listing = await this.listings.findOne({ where: { id } });
      if (!listing) throw new NotFoundException('Aviso no encontrado');
      if (listing.ownerId !== ownerId) throw new Error('FORBIDDEN');
      Object.assign(listing, dto);
      return await this.listings.save(listing);
    } catch (err) {
      if (err instanceof Error && err.message === 'FORBIDDEN') {
        const e = new NotFoundException('Aviso no encontrado');
        // translate to NotFound to avoid exposing existence to non-owners
        throw e;
      }
      console.error('ListingsService.update error:', err);
      throw err;
    }
  }

  async remove(user: { id: string; roles?: string[] }, id: string) {
    const listing = await this.listings.findOne({ where: { id } });
    if (!listing) throw new NotFoundException('Aviso no encontrado');
    const isAdmin = user.roles?.includes(Role.Admin);
    if (!isAdmin && listing.ownerId !== user.id) throw new NotFoundException('Aviso no encontrado');
    return this.listings.remove(listing);
  }
}
