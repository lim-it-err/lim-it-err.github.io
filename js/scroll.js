class InfiniteScroll {
    constructor(path, wrapperSelector) {
        if (!path || !wrapperSelector) {
            throw new Error('InfiniteScroll requires both a path and a wrapper selector.');
        }

        this.path = path;
        this.pNum = 1;
        this.wrapperSelector = wrapperSelector;
        this.wNode = document.querySelector(wrapperSelector);
        this.enable = true;
        this.loadPosts();
    }

    async loadPosts() {
        while (this.enable) {
            try {
                const response = await fetch(`${location.origin}${this.path}${this.pNum}/index.html`);
                if (response.ok) {
                    const responseText = await response.text();
                    this.processContent(responseText);
                    this.pNum++;
                } else {
                    this.enable = false;
                }
            } catch (error) {
                console.error('Fetch error:', error);
                this.enable = false;
            }
        }
    }

    processContent(htmlText) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, "text/html");

        const titleText = doc.title || `Article ${this.pNum}`;
        this.createTitleButton(titleText, doc.body.innerHTML);
    }

    createTitleButton(title, contentHTML) {
        const titleButton = document.createElement('div');
        titleButton.classList.add('title-button');

        const numberCircle = document.createElement('div');
        numberCircle.classList.add('number-circle');
        numberCircle.textContent = this.pNum;
        titleButton.appendChild(numberCircle);

        const titleSpan = document.createElement('span');
        titleSpan.textContent = title;
        titleButton.appendChild(titleSpan);

        const contentDiv = document.createElement('div');
        contentDiv.innerHTML = contentHTML;
        contentDiv.style.display = 'none';

        titleButton.addEventListener('click', () => {
            const isDisplayed = contentDiv.style.display !== 'none';
            contentDiv.style.display = isDisplayed ? 'none' : '';
        });

        this.wNode.appendChild(titleButton);
        this.wNode.appendChild(contentDiv);
    }
}
