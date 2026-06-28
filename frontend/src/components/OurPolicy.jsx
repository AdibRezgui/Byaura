const OurPolicy = () => {
  const items = [
    {
      num: "01",
      title: "Échanges faciles",
      body: "Retournez ou échangez votre article sous 14 jours, sans justification.",
    },
    {
      num: "02",
      title: "Qualité garantie",
      body: "Chaque pièce est contrôlée avant expédition. Satisfaction ou remboursement.",
    },
    {
      num: "03",
      title: "Livraison soignée",
      body: "Emballage éditorial, livraison suivie partout en Tunisie.",
    },
  ];

  return (
    <div className="border-t border-b border-gray-100 py-14 my-16">
      <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
        {items.map((item) => (
          <div key={item.num} className="py-8 sm:py-0 sm:px-10 first:pl-0 last:pr-0 flex flex-col gap-3">
            <span className="text-[10px] tracking-[0.3em] uppercase text-gray-300">{item.num}</span>
            <p className="text-sm font-medium text-gray-900 tracking-wide">{item.title}</p>
            <p className="text-xs text-gray-400 leading-relaxed">{item.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OurPolicy;
