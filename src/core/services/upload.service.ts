import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { catchError, from, map, Observable, tap, throwError } from 'rxjs';
import {
  v2 as cloudinary,
  UploadApiErrorResponse,
  UploadApiResponse,
} from 'cloudinary';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UploadService {
  constructor(private configService: ConfigService) {
    cloudinary.config({
      cloud_name: configService.get<string>('cloudinary.name'),
      api_key: configService.get<string>('cloudinary.apiKey'),
      api_secret: configService.get<string>('cloudinary.apiSecret'),
    });
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
}
