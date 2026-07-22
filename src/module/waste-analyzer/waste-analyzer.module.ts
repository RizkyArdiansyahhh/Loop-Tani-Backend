import { Module } from '@nestjs/common';
import { WasteAnalyzerController } from './waste-analyzer.controller';
import { WasteAnalyzerService } from './waste-analyzer.service';

@Module({
  controllers: [WasteAnalyzerController],
  providers: [WasteAnalyzerService],
})
export class WasteAnalyzerModule {}
