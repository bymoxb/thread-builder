import { useMemo, useState } from "preact/hooks";
import { Token } from "../lib/token";
import { PostModeEnum, TPost } from "../lib/tpost";
import Post from "./Post";
import RadioButton from "./RadioButton";

export default function Content() {

  const [content, setContent] = useState("");
  const [mode, setMode] = useState(PostModeEnum.TWITTER);

  const tokens = useMemo(() => {
    return Token.tokenize(content);
  }, [content]);

  const posts = useMemo(() => {
    const tweetChain = TPost.createTweetChain(tokens, mode);
    return tweetChain.toPosts();
  }, [tokens, mode])

  return (
    <main class="flex flex-col py-5 gap-4">
      <section class="flex gap-4">
        <RadioButton
          id="twitter"
          name="twitter"
          label="X (Twitter)"
          checked={mode === PostModeEnum.TWITTER}
          onChange={() => setMode(PostModeEnum.TWITTER)}
        />

        <RadioButton
          id="threads"
          name="threads"
          label="Threads"
          checked={mode === PostModeEnum.THREADS}
          onChange={() => setMode(PostModeEnum.THREADS)}
        />
      </section>

      <section class="grid grid-cols-2 gap-4 ">
        <textarea
          id="post-content"
          placeholder="Write your post"
          class="border rounded p-4 h-full"
          value={content}
          onInput={(e) => setContent(e.currentTarget.value)}
        />

        <div class="flex flex-col gap-4 overflow-auto text-wrap">
          {
            posts.map((p, index) => (
              <Post key={index} post={p} />
            ))
          }
        </div>
      </section>
    </main>
  )
}