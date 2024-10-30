export const mapTagsToOptions = (tags: { label: string; value: string }[]) => {
  return tags.map((tag) => ({
    label: tag.label,
    value: Number(tag.value),
  }));
};
