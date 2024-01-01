import { useMemo, useState } from "preact/hooks";

export default function Content() {

  const [tweet, setTweet] = useState(`Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos eaque numquam explicabo deleniti inventore esse possimus, quam suscipit ullam, blanditiis reprehenderit dicta ea asperiores sequi quaerat facilis? Laudantium, quas blanditiis.`)

  const tweets = useMemo(() => {
    const longitudMaxima = 280

    function dividirTexto(texto: string) {
      let palabras = texto.split(' ');
      let resultado = [];
      let textoActual = palabras[0];

      for (let i = 1; i < palabras.length; i++) {
        let palabra = palabras[i];

        if ((textoActual + ' ' + palabra).length <= longitudMaxima) {
          textoActual += ' ' + palabra;
        } else {
          resultado.push(textoActual);
          textoActual = palabra;
        }
      }

      resultado.push(textoActual);

      return resultado;
    }

    const temp: string[] = []
    const tweets = tweet.split("\n\n\n")

    for (let i = 0; i < tweets.length; i++) {
      const element = tweets[i];
      const t = dividirTexto(element)
      temp.push(...t)
    }

    return temp

  }, [tweet])

  return (
    <main class="grid grid-cols-2 gap-4 h-full">
      <textarea
        id="tweet-value"
        class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder="Write your tweet"
        defaultValue={tweet}
        value={tweet}
        onInput={(e) => setTweet(e.currentTarget.value)}
      >
      </textarea>
      <div class="flex flex-col gap-4 overflow-hidden overflow-y-auto">
        {
          tweets.map(t => (
            <p class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">{t}</p>
          ))
        }
      </div>
    </main>
  )
}