import { client } from './cache-connection.service'
import { ICacheArgs } from './interface/cache-service.interface'

export class CacheService {
  private static readonly client = client()

  static readonly get = async (key: string): Promise<any | null> => {
    const value = await (await this.client).get(key)

    let parsedValue: { expiresAfter: number; value: unknown[] } | null = null

    if (value) parsedValue = JSON.parse(value)

    return parsedValue ?? null
  }

  static readonly set = async ({
    key,
    value,
    expiresAfter,
  }: ICacheArgs): Promise<string | null> => {
    return await (
      await this.client
    ).set(key, JSON.stringify({ expiresAfter, value }), {
      ...(expiresAfter && { expiration: { type: 'EX', value: expiresAfter } }),
    })
  }

  static readonly add = async ({ key, value }: { key: string; value: any }) => {
    const cachedValue: { expiresAfter: number; value: unknown[] } =
      await this.get(key)

    if (!cachedValue) return

    const newValue = cachedValue.value

    newValue.unshift(value)

    return await this.set({
      key,
      value: newValue,
      expiresAfter: cachedValue.expiresAfter,
    })
  }

  static readonly update = async ({
    key,
    obj,
    identifier,
  }: {
    key: string
    obj: any
    identifier: string
  }) => {
    const cachedValue: { expiresAfter: number; value: any } =
      await this.get(key)

    if (!cachedValue) return

    if (identifier == '_id') {
      const newValue = cachedValue.value.map((item: any) => {
        if (item[identifier].toString() == obj[identifier].toString()) {
          item = { ...item, ...obj }
          return item
        }

        return item
      })

      return await this.set({
        key,
        value: newValue,
        expiresAfter: cachedValue.expiresAfter,
      })
    }

    const newValue = cachedValue.value.map((item: any) => {
      if (item[identifier] == obj[identifier]) {
        item = { ...item, ...obj }
        return item
      }

      return item
    })

    return await this.set({ key, value: newValue })
  }

  static readonly remove = async ({
    key,
    value,
    identifier,
  }: {
    key: string
    value: any
    identifier: string
  }) => {
    const cachedValue: { expiresAfter: number; value: any } =
      await this.get(key)

    if (!cachedValue) return

    if (identifier == '_id') {
      const newValue = cachedValue.value.filter(
        (item: any) => item[identifier].toString() != value.toString(),
      )
      return await this.set({
        key,
        value: newValue,
        expiresAfter: cachedValue.expiresAfter,
      })
    }

    const newValue = cachedValue.value.filter(
      (item: any) => item[identifier] != value,
    )

    return await this.set({ key, value: newValue })
  }
}
