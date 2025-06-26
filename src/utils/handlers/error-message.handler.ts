export const throwError = ({
  msg,
  details,
  status,
}: {
  msg: string
  details?: Object
  status: 400 | 403 | 404 | 409
}) => {
  throw {
    msg,
    details,
    status,
  }
}
