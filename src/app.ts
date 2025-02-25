import { OPENAI_API_KEY } from './config.js';

class QuoteGenerator {
    private quoteElement: HTMLParagraphElement | null;
    private button: HTMLButtonElement | null;
    private apiUrl = 'https://api.openai.com/v1/chat/completions';

    constructor(private apiKey: string) {
        this.quoteElement = document.getElementById('quote') as HTMLParagraphElement;
        this.button = document.getElementById('getQuote') as HTMLButtonElement;
        
        this.setupEventListeners();
        // Don't auto-generate on load to avoid immediate API call
        this.quoteElement.textContent = 'Click the button to get a quote!';
    }

    private setupEventListeners(): void {
        this.button?.addEventListener('click', () => this.generateQuote());
    }

    private async generateQuote(): Promise<void> {
        if (!this.button || !this.quoteElement) return;

        try {
            this.button.disabled = true;
            this.button.textContent = 'Loading...';
            this.quoteElement.textContent = 'Connecting to API...';

            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages: [{
                        role: "user",
                        content: "Generate a short motivational quote with its author. Format: 'Quote' - Author"
                    }],
                    max_tokens: 100,
                    temperature: 0.7
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('API Error:', errorData);
                throw new Error(errorData.error?.message || `API error: ${response.status}`);
            }
            
            const data = await response.json();
            const quote = data.choices[0]?.message?.content;
            
            if (quote) {
                this.quoteElement.textContent = quote;
            } else {
                throw new Error('No quote received');
            }
        } catch (error) {
            console.error('Error:', error);
            this.quoteElement.textContent = error instanceof Error ? error.message : 
                'Failed to generate quote. Please try again later.';
        } finally {
            this.button.disabled = false;
            this.button.textContent = 'Get Quote';
        }
    }
}

// Initialize when the page loads
window.addEventListener('DOMContentLoaded', () => {
    new QuoteGenerator(OPENAI_API_KEY);
}); 