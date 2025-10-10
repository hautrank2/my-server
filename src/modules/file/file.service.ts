import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { ConfigService } from '@nestjs/config';
import {
  v2 as cloudinary,
  UploadApiErrorResponse,
  UploadApiResponse,
} from 'cloudinary';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { catchError, from, map, Observable, tap, throwError } from 'rxjs';
import { httpClient } from 'src/lib/http';

@Injectable()
export class FileService {
  constructor(private configService: ConfigService) {
    cloudinary.config({
      cloud_name: configService.get<string>('cloudinary.name'),
      api_key: configService.get<string>('cloudinary.apiKey'),
      api_secret: configService.get<string>('cloudinary.apiSecret'),
    });
  }

  create(createFileDto: CreateFileDto) {
    return 'This action adds a new file';
  }

  findAll() {
    return `This action returns all file`;
  }

  findOne(id: number) {
    return `This action returns a #${id} file`;
  }

  update(id: number, updateFileDto: UpdateFileDto) {
    return `This action updates a #${id} file`;
  }

  remove(id: number) {
    return `This action removes a #${id} file`;
  }

  uploadFile(
    file: Express.Multer.File,
    folder: string[],
    fileName?: string,
  ): Observable<string> {
    return from(
      cloudinary.uploader.upload(
        `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
        {
          public_id: fileName
            ? `${fileName}-${Date.now()}`
            : Date.now().toString(),
          folder: folder.join('/'),
        },
      ),
    ).pipe(
      tap(res => console.log('upload success', res)),
      map((res: UploadApiResponse) => res.public_id),
      catchError((err: UploadApiErrorResponse) => {
        console.error('Cloudinary upload failed:', {
          message: err?.message,
          http_code: err?.http_code,
          name: err?.name,
          error: err?.error,
        });

        if (err?.http_code === 400) {
          return throwError(
            () =>
              new BadRequestException(err?.message ?? 'Invalid upload payload'),
          );
        }

        return throwError(
          () =>
            new InternalServerErrorException(
              'Upload failed, please try later !!',
            ),
        );
      }),
    );
  }

  removeFile(path: string): Observable<string> {
    return from(cloudinary.uploader.destroy(path)).pipe(
      map((res: UploadApiResponse) => {
        return res.public_id;
      }),
    );
  }

  async downloadFile(id: string) {
    const format = 'pdf';
    const url = cloudinary.utils.private_download_url(id, format, {});
    console.log('url', id, url);
    const response = await httpClient.get(url, { responseType: 'stream' });

    return {
      stream: response.data as NodeJS.ReadableStream,
      headers: {
        'content-type': response.headers['content-type'],
        'content-length': response.headers['content-length'],
        // Nếu muốn override tên file tải xuống ở header (ưu tiên hơn URL flags):
        'content-disposition':
          response.headers['content-disposition'] ||
          `attachment; filename="${id.replace(/"/g, '')}${format ? '.' + format : ''}"`,
      },
    };
  }
}
