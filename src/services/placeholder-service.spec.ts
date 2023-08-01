import { of, throwError } from 'rxjs';
import { PlaceholderService } from './placeholder-service';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
describe('PlaceholderService', () => {
  let service: PlaceholderService;
  let httpClientSpy: any;

  beforeEach(() => {
    httpClientSpy = {
      get: jest.fn(),
      post: jest.fn(),
    };
    service = new PlaceholderService(httpClientSpy);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should test getDataV1', () => {
    const response = 'Server Response';
    const url = 'https://jsonplaceholder.typicode.com/todos/1';
    jest.spyOn(httpClientSpy, 'get').mockReturnValue(of(response));
    service.getDataV1();

    expect(httpClientSpy.get).toBeCalledTimes(1);
    expect(httpClientSpy.get).toBeCalledWith(url);
  });

  it('should test getDataV2', (done) => {
    const response = 'Server Response';
    const url = 'https://jsonplaceholder.typicode.com/todos/1';
    jest.spyOn(httpClientSpy, 'get').mockReturnValue(of(response));
    service.getDataV2().subscribe({
      next: (data) => {
        expect(data).toEqual(response);
        done();
      },
      error: (error) => console.log(error),
    });

    expect(httpClientSpy.get).toBeCalledTimes(1);
    expect(httpClientSpy.get).toBeCalledWith(url);
  });

  it('should getDataV2 throw error', (done) => {
    const errorResponse = new HttpErrorResponse({
      error: 'Test 404 error',
      status: 404,
      statusText: 'Not Found',
    });

    const url = 'https://jsonplaceholder.typicode.com/todos/1';
    jest
      .spyOn(httpClientSpy, 'get')
      .mockReturnValue(throwError(() => errorResponse));
    service.getDataV2().subscribe({
      next: () => console.log,
      error: (error) => {
        expect(error.message).toContain('Test 404 error');
        done();
      },
    });

    expect(httpClientSpy.get).toBeCalledTimes(1);
    expect(httpClientSpy.get).toBeCalledWith(url);
  });

  it('should test postDataV1', () => {
    const serverResponse = 'Server Response';
    const url = 'https://jsonplaceholder.typicode.com/todos/1';
    jest.spyOn(httpClientSpy, 'post').mockReturnValue(of(serverResponse));
    service.postDataV1('data');
    expect(httpClientSpy.post).toBeCalledTimes(1);
  });
});
