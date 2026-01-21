import { PartialType } from '@nestjs/mapped-types';
import { CreateLoadRequestDto } from './create-load-request.dto';

export class UpdateLoadRequestDto extends PartialType(CreateLoadRequestDto) {}
