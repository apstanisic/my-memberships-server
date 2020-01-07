import { UUID, Image } from 'nestjs-extra';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Location } from '../locations/location.entity';

/** Location's images */
@Entity('location_images')
export class LocationImage extends Image {
  @ManyToOne(
    type => Location,
    location => location.images,
    { onDelete: 'CASCADE' },
  )
  location: Location;

  @Column()
  locationId: UUID;
}
