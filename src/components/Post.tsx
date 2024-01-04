import type { VPost } from "../lib/vpost";
import Bubble from "./Bubble";
import CopyButton from "./CopyButton";

type PostProps = {
  post: VPost,
}

export default function Post({ post }: PostProps) {
  return (
    <section class="relative min-h-20 w-full border rounded">

      <Bubble class="absolute top-2 right-2" value={`${post.length()}/${post.maxLength()}`} />

      <p class="py-8 px-2" dangerouslySetInnerHTML={{ __html: post.text() }}></p>

      <CopyButton class="absolute bottom-2 right-2 h-5" text={post.text()} />
    </section>
  )
}
