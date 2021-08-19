import { Atom, atom, WritableAtom } from 'jotai'

enum Harmony {
  FRONT = 1,
  NEUTRAL = 0,
  BACK = -1,
}

export interface Change {
  others: boolean
  index: number
  text: string
}

const pattern = /([bcdfghjklmnpqrstvwxz]*)(a+|e+|i+|o+|u+|y+|å+|ä+|ö+)([abcdefghijklmnopqrstuvwxyzåäö]*)/

const harmony = (word: string) =>
  word.match(/[äöy]/)
    ? Harmony.FRONT
    : word.match(/[aou]/)
      ? Harmony.BACK
      : Harmony.NEUTRAL

const applyHarmony = (h: Harmony, x: string) =>
  h === Harmony.FRONT
    ? x.replaceAll('a', 'ä').replaceAll('o', 'ö').replaceAll('u', 'y')
    : h === Harmony.BACK
      ? x.replaceAll('ä', 'a').replaceAll('ö', 'o').replaceAll('y', 'u')
      : x

const stretch = (toLength: number, x: string) =>
  x[0].repeat(toLength)

const reharm = (a: string, b: string, x: string) => {
  const mA = a.match(pattern)
  const mB = b.match(pattern)
  const mX = x.match(pattern)

  if (mX === null) {
    return [a, b]
  }

  const [, , wovelA, endA] = mA || mX
  const [, startB, wovelB,] = mB || mX
  const [, startX, wovelX, endX] = mX

  const harmA = harmony(a)
  const harmB = harmony(wovelB)

  return [
    [
      startX,
      stretch(wovelA.length, wovelX),
      applyHarmony(harmA, endA),
    ].join(""),
    [
      startB,
      stretch(wovelX.length, wovelB),
      applyHarmony(harmB, endX),
    ].join(""),
  ]
}

export const useSusikoira = (): [Atom<string>[], WritableAtom<string[], Change>] => {
  const atoms = [
    atom(''),
    atom(''),
    atom(''),
    atom(''),
  ]

  const koiro = atom(
    get => atoms.map(get) as string[],
    (get, set, { others, index, text: _text }: Change) => {
      const text = _text.toLowerCase()
      if (others) {
        const indexA = 3 - index
        const indexB = (index + 2) % 4

        const a = get(atoms[indexA])
        const b = get(atoms[indexB])

        const reh = reharm(a, b, text)
        set(atoms[indexA], reh[0])
        set(atoms[indexB], reh[1])
      } else {
        set(atoms[index], text)
      }
    })

  return [atoms, koiro]
}
