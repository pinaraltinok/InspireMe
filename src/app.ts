class QuoteGenerator {
    private quoteElement: HTMLParagraphElement | null;
    private button: HTMLButtonElement | null;
    private apiUrl = 'https://api.api-ninjas.com/v1/quotes';
    private apiKey = '1lXdKD8u+L2jSy6Tnw72xg==34jap8f4t2sLWut4';

    constructor() {
        this.quoteElement = document.getElementById('quote') as HTMLParagraphElement;
        this.button = document.getElementById('getQuote') as HTMLButtonElement;
        
        this.setupEventListeners();
        this.quoteElement.textContent = 'Click the button to get a quote!';
    }

    private async generateQuote(): Promise<void> {
        if (!this.button || !this.quoteElement) return;

        try {
            this.button.disabled = true;
            this.button.textContent = 'Loading...';
            this.quoteElement.textContent = 'Fetching quote...';

            const response = await fetch(this.apiUrl, {
                method: 'GET',
                headers: {
                    'X-Api-Key': this.apiKey
                }
            });

            if (!response.ok) {
                console.error('Response:', await response.text());
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const [data] = await response.json();
            const quote = `"${data.quote}" - ${data.author}`;
            this.quoteElement.textContent = quote;

        } catch (error) {
            console.error('Error:', error);
            this.quoteElement.textContent = 'Failed to fetch quote. Please try again later.';
        } finally {
            this.button.disabled = false;
            this.button.textContent = 'Get Quote';
        }
    }

    private setupEventListeners(): void {
        this.button?.addEventListener('click', () => this.generateQuote());
    }
}

class ThemeSwitch {
    private checkbox: HTMLInputElement | null;

    constructor() {
        this.checkbox = document.getElementById('checkbox') as HTMLInputElement;
        this.setupEventListeners();
        this.initializeTheme();
    }

    private setupEventListeners(): void {
        this.checkbox?.addEventListener('change', () => this.switchTheme());
    }

    private initializeTheme(): void {
        if (localStorage.getItem('theme') === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            if (this.checkbox) this.checkbox.checked = true;
        }
    }

    private switchTheme(): void {
        if (this.checkbox?.checked) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        }
    }
}

// Initialize when the page loads
window.addEventListener('DOMContentLoaded', () => {
    new QuoteGenerator();
    new ThemeSwitch();
}); 