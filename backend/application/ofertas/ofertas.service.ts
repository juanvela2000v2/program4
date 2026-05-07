import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Oferta } from '../../infrastructure/schemas/oferta.schema';

@Injectable()
export class OfertasService {
  constructor(@InjectModel(Oferta.name) private ofertaModel: Model<Oferta>) {}

  listar() {
    return this.ofertaModel.find().exec();
  }

  crear(payload: any) {
    const oferta = new this.ofertaModel(payload);
    return oferta.save();
  }
}
