import { ApiProperty } from '@nestjs/swagger';

export class CheckoutShippingResponseDto {
  @ApiProperty({ example: null, nullable: true, description: 'Kode kurir pengiriman (misal: JNE, POS, TIKI)' })
  courier: string | null;

  @ApiProperty({ example: null, nullable: true, description: 'Nama layanan pengiriman (misal: REG, YES)' })
  service: string | null;

  @ApiProperty({ example: null, nullable: true, description: 'Estimasi hari pengiriman (misal: 2-3 hari)' })
  etd: string | null;

  @ApiProperty({ example: 0, description: 'Biaya ongkos kirim' })
  cost: number;
}
