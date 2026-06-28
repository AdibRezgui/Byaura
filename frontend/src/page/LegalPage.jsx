const Section = ({ title, children }) => (
  <div className="mb-10">
    <p className="text-[10px] tracking-[0.35em] uppercase text-gray-400 mb-3">{title}</p>
    <div className="text-sm text-gray-600 leading-loose">{children}</div>
  </div>
);

const LegalPage = () => (
  <div className="pt-12 pb-24 border-t border-gray-100 max-w-2xl">
    <p className="text-[10px] tracking-[0.4em] uppercase text-gray-400 mb-2">Informations légales</p>
    <h1 className="prata-regular text-3xl font-light text-gray-900 mb-12">Mentions légales.</h1>

    <Section title="Éditeur du site">
      <p>AURA — Marque de prêt-à-porter</p>
      <p>Tunis, Tunisie</p>
      <p>Email : <a href="mailto:contact@byaura.com" className="underline hover:text-black">contact@byaura.com</a></p>
    </Section>

    <Section title="Hébergement">
      <p>Le site est hébergé par un prestataire tiers. Pour toute question technique, contactez-nous à l'adresse ci-dessus.</p>
    </Section>

    <Section title="Propriété intellectuelle">
      <p>L'ensemble des contenus présents sur ce site (textes, images, photographies, vidéos, logos) sont la propriété exclusive d'AURA et sont protégés par les lois relatives à la propriété intellectuelle. Toute reproduction, même partielle, est strictement interdite sans autorisation préalable.</p>
    </Section>

    <Section title="Données personnelles">
      <p>Les informations collectées lors de vos commandes (nom, adresse, email) sont utilisées uniquement pour le traitement de vos commandes et ne sont jamais cédées à des tiers. Conformément à la réglementation applicable, vous disposez d'un droit d'accès, de rectification et de suppression de vos données en nous contactant à <a href="mailto:contact@byaura.com" className="underline hover:text-black">contact@byaura.com</a>.</p>
    </Section>

    <Section title="Cookies">
      <p>Ce site utilise uniquement des cookies strictement nécessaires au bon fonctionnement du panier et de l'authentification. Aucun cookie de traçage publicitaire n'est utilisé.</p>
    </Section>

    <Section title="Litiges">
      <p>En cas de litige, une solution amiable sera recherchée avant tout recours judiciaire. Le droit tunisien est applicable.</p>
    </Section>
  </div>
);

export default LegalPage;
