/**
 * ProductStory Embed Script v2
 * 
 * Usage (Method 1 - Programmatic):
 * <div id="productstory-demo"></div>
 * <script src="https://shipkit.app/embed.js"></script>
 * <script>
 *   ProductStory.init({
 *     container: '#productstory-demo',
 *     demoId: 'abc123',
 *     width: '100%',
 *     height: 'auto',
 *     autoplay: false
 *   });
 * </script>
 * 
 * Usage (Method 2 - Data Attributes):
 * <div data-productstory="abc123" data-height="600"></div>
 * <script src="https://shipkit.app/embed.js"></script>
 */

(function () {
    'use strict';

    // Auto-detect base URL or use configured one
    const SCRIPT_URL = document.currentScript?.src || '';
    const BASE_URL = SCRIPT_URL
        ? new URL(SCRIPT_URL).origin
        : (window.PRODUCTSTORY_BASE_URL || 'https://shipkit.app');

    const ProductStory = {
        demos: [],
        version: '2.0.0',

        /**
         * Initialize a demo embed
         */
        init: function (config) {
            const {
                container,
                demoId,
                width = '100%',
                height = 'auto',
                autoplay = false,
                hideBranding = false,
            } = config;

            if (!container || !demoId) {
                console.error('[ProductStory] container and demoId are required');
                return null;
            }

            const containerEl = typeof container === 'string'
                ? document.querySelector(container)
                : container;

            if (!containerEl) {
                console.error('[ProductStory] Container not found:', container);
                return null;
            }

            // Create wrapper for styling
            const wrapper = document.createElement('div');
            wrapper.style.position = 'relative';
            wrapper.style.width = width;
            wrapper.style.minHeight = height === 'auto' ? '400px' : height;

            // Create iframe with embed route
            const iframe = document.createElement('iframe');
            const params = new URLSearchParams();
            if (autoplay) params.set('autoplay', 'true');
            if (hideBranding) params.set('hideBranding', 'true');

            // Use dedicated embed route
            iframe.src = `${BASE_URL}/productstory/embed/${demoId}${params.toString() ? '?' + params.toString() : ''}`;
            iframe.style.width = '100%';
            iframe.style.height = height === 'auto' ? '600px' : height;
            iframe.style.border = 'none';
            iframe.style.borderRadius = '12px';
            iframe.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
            iframe.allow = 'clipboard-write; fullscreen';
            iframe.loading = 'lazy';
            iframe.title = 'ProductStory Interactive Demo';
            iframe.setAttribute('role', 'application');
            iframe.dataset.productstoryId = demoId;

            wrapper.appendChild(iframe);
            containerEl.innerHTML = '';
            containerEl.appendChild(wrapper);

            // Track this demo
            const demoInstance = {
                id: demoId,
                iframe,
                wrapper,
                container: containerEl,
                autoHeight: height === 'auto',
            };
            this.demos.push(demoInstance);

            return {
                destroy: () => this.destroy(demoId),
                resize: (w, h) => this.resize(demoId, w, h),
                goToStep: (step) => this.goToStep(demoId, step),
            };
        },

        /**
         * Handle incoming messages from iframes
         */
        handleMessage: function (event) {
            const data = event.data;
            if (!data || !data.source || data.source !== 'productstory-embed') return;

            const { type } = data;

            switch (type) {
                case 'productstory:resize':
                    // Find the iframe that sent this message
                    for (const demo of this.demos) {
                        if (demo.iframe.contentWindow === event.source && demo.autoHeight) {
                            demo.iframe.style.height = `${data.height}px`;
                        }
                    }
                    break;

                case 'productstory:ready':
                    // Emit ready event
                    window.dispatchEvent(new CustomEvent('productstory:ready', { detail: data }));
                    break;

                case 'productstory:step_change':
                    window.dispatchEvent(new CustomEvent('productstory:step_change', { detail: data }));
                    break;

                case 'productstory:complete':
                    window.dispatchEvent(new CustomEvent('productstory:complete', { detail: data }));
                    break;
            }
        },

        /**
         * Destroy a demo instance
         */
        destroy: function (demoId) {
            const index = this.demos.findIndex(d => d.id === demoId);
            if (index !== -1) {
                const demo = this.demos[index];
                demo.container.innerHTML = '';
                this.demos.splice(index, 1);
            }
        },

        /**
         * Resize a demo
         */
        resize: function (demoId, width, height) {
            const demo = this.demos.find(d => d.id === demoId);
            if (demo) {
                if (width) demo.wrapper.style.width = width;
                if (height) {
                    demo.iframe.style.height = height;
                    demo.autoHeight = false;
                }
            }
        },

        /**
         * Navigate to a specific step
         */
        goToStep: function (demoId, step) {
            const demo = this.demos.find(d => d.id === demoId);
            if (demo) {
                demo.iframe.contentWindow?.postMessage({
                    type: 'productstory:go_to_step',
                    step,
                }, '*');
            }
        },

        /**
         * Auto-init demos from data attributes
         */
        autoInit: function () {
            const elements = document.querySelectorAll('[data-productstory]');
            elements.forEach(el => {
                const demoId = el.dataset.productstory;
                const height = el.dataset.height || 'auto';
                const hideBranding = el.dataset.hideBranding === 'true';
                const autoplay = el.dataset.autoplay === 'true';

                if (demoId) {
                    this.init({
                        container: el,
                        demoId,
                        height: height === 'auto' ? 'auto' : `${height}px`,
                        hideBranding,
                        autoplay,
                    });
                }
            });
        },
    };

    // Setup global message listener
    window.addEventListener('message', (e) => ProductStory.handleMessage(e));

    // Auto-init on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => ProductStory.autoInit());
    } else {
        ProductStory.autoInit();
    }

    // Expose to window
    if (typeof window !== 'undefined') {
        window.ProductStory = ProductStory;
    }
})();
