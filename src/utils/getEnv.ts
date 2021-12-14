enum ENV {
  DEV = 'development',
  TEST = 'test',
  PROD = 'production',
}

export const isDev = () => process.env.NODE_ENV === ENV.DEV

export const isTest = () => process.env.NODE_ENV === ENV.TEST

export const idProd = () => process.env.NODE_ENV === ENV.PROD
