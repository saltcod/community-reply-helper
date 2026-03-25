export function getThreadExternalUrl(
  threadKey: string | null | undefined,
  externalActivityUrl: string | null | undefined,
) {
  if (externalActivityUrl) {
    return externalActivityUrl;
  }

  if (!threadKey) {
    return null;
  }

  const [source, ...rest] = threadKey.split(":");
  const identifier = rest.join(":");

  if (!identifier) {
    return null;
  }

  switch (source) {
    case "discord":
      return `https://discord.com/channels/839993398554656828/${identifier}/${identifier}`;
    case "reddit":
      return `https://reddit.com/comments/${identifier}`;
    case "github":
      return `https://github.com/${identifier.replace(/^orgs\//, "")}`;
    default:
      return null;
  }
}
