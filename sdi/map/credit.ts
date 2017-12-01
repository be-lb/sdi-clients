

export const credit =
    () => {
        const elem = document.createElement('div');
        const anchor = document.createElement('a');

        elem.setAttribute('class', 'credit');
        anchor.appendChild(document.createTextNode('©'));
        anchor.setAttribute('href', 'https://www.atelier-cartographique.be');
        anchor.setAttribute('title', 'Spatial Data Infrastructure © atelier cartographique');
        anchor.setAttribute('target', '_blank');

        elem.appendChild(anchor);

        return elem;
    };
