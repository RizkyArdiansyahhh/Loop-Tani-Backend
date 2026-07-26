import { ApiProperty } from '@nestjs/swagger';

export class CheckoutAddressResponseDto {
  @ApiProperty({ example: 'f8e7d6c5-b4a3-2f1e-0d9c-8b7a6f5e4d3c', description: 'ID Alamat' })
  id: string;

  @ApiProperty({ example: 'Budi Santoso', description: 'Nama penerima' })
  recipientName: string;

  @ApiProperty({ example: '6281234567890', description: 'Nomor telepon penerima' })
  recipientPhone: string;

  @ApiProperty({
    example: 'Jl. Ir. H. Juanda No. 123, Dago, Coblong, Kota Bandung, Jawa Barat, 40135',
    description: 'Alamat lengkap gabungan',
  })
  fullAddress: string;

  @ApiProperty({ example: 'Jawa Barat', description: 'Provinsi' })
  province: string;

  @ApiProperty({ example: 'Kota Bandung', description: 'Kota/Kabupaten' })
  city: string;

  @ApiProperty({ example: 'Coblong', description: 'Kecamatan' })
  district: string;

  @ApiProperty({ example: 'Dago', description: 'Kelurahan/Desa' })
  subDistrict: string;

  @ApiProperty({ example: '40135', description: 'Kode pos' })
  postalCode: string;

  @ApiProperty({ example: true, description: 'Apakah alamat utama user' })
  isDefault: boolean;
}
