export class Api {
  private baseURI: string
  private requestInit: RequestInit
  constructor(init: RequestInit, baseURI: string) {
    this.baseURI = baseURI
    this.requestInit = init
  }
  static fetch(api: RequestInfo, data: any, newBaseURI?: string): Promise<any> {
    return fetch(api, data).then(response => {
      if (response.ok) {
        return response.json()
      }
      throw new Error(response.statusText)
    })
  }
  get = <T = any>(
    api: RequestInfo,
    data: any = {},
    newBaseURI?: string
  ): Promise<T> => {
    const baseURI = newBaseURI === undefined ? this.baseURI : newBaseURI
    const url = new URL(baseURI + api)
    url.search = new URLSearchParams(data).toString()
    return Api.fetch(url.toString(), this.requestInit, newBaseURI)
  }
  post = <T = any>(
    api: RequestInfo,
    data: any = {},
    newBaseURI?: string
  ): Promise<T> => {
    const baseURI = newBaseURI === undefined ? this.baseURI : newBaseURI
    const url = baseURI + api
    let requestData = Object.assign({}, this.requestInit, {
      body: JSON.stringify(data),
    })
    return Api.fetch(url, requestData, newBaseURI)
  }
}

const defaultBaseURI = process.env.REACT_APP_API_URL || ''

const defaultRequestInit = {
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
}

export default new Api(defaultRequestInit, defaultBaseURI)
