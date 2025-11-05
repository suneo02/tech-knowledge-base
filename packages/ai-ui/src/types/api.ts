export interface KnownError<T> {
  errorCode: string
  errorMessage: string
  data?: T
}
