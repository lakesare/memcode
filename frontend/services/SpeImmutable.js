const SpeImmutable = {
  create: (spe, newItem, options = {}) => {
    const optionsWithDefaults = {
      asFirst: false,
      ...options
    };
    const payload = optionsWithDefaults.asFirst ?
      [newItem, ...spe.payload] :
      [...spe.payload, newItem];

    return { ...spe, payload };
  },
  update: (spe, updatedItem) => {
    const prevItems = spe.payload;
    const updatedItemIndex = prevItems.findIndex((li) => li.id === updatedItem.id);
    const payload = [
      ...prevItems.slice(0, updatedItemIndex),
      updatedItem,
      ...prevItems.slice(updatedItemIndex + 1)
    ];
    return { ...spe, payload };
  },
  destroy: (spe, idToDestroy) => ({
    ...spe,
    payload: spe.payload.filter((item) =>
      item.id !== idToDestroy
    )
  })
};

export default SpeImmutable;
