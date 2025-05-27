// Chat Widget Script
(function () {
  // Create and inject styles
  const styles = `
        .n8n-chat-widget {
            --chat--color-primary: var(--n8n-chat-primary-color, #854fff);
            --chat--color-secondary: var(--n8n-chat-secondary-color, #6b3fd4);
            --chat--color-background: var(--n8n-chat-background-color, #ffffff);
            --chat--color-font: var(--n8n-chat-font-color, #333333);
            --chat--color-light: var(--n8n-chat-light-color, #f0f0f0);
            --chat--color-typing: var(--n8n-chat-typing-color, #007bff);
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        }

        .n8n-chat-widget .chat-container {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 1000;
            display: none;
            width: 380px;
            height: 600px;
            background: var(--chat--color-background);
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(133, 79, 255, 0.15);
            border: 1px solid rgba(133, 79, 255, 0.2);
            overflow: hidden;
            font-family: inherit;
        }

        .n8n-chat-widget .chat-container.position-left {
            right: auto;
            left: 20px;
        }

        .n8n-chat-widget .chat-container.open {
            display: flex;
            flex-direction: column;
        }

        .n8n-chat-widget .brand-header {
            padding: 16px;
            display: flex;
            align-items: center;
            gap: 12px;
            border-bottom: 1px solid rgba(133, 79, 255, 0.1);
            position: relative;
        }

        .n8n-chat-widget .close-button {
            position: absolute;
            right: 16px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            color: var(--chat--color-font);
            cursor: pointer;
            padding: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: color 0.2s;
            font-size: 20px;
            opacity: 0.6;
        }

        .n8n-chat-widget .close-button:hover {
            opacity: 1;
        }

        .n8n-chat-widget .brand-header img {
            width: 32px;
            height: 32px;
        }

        .n8n-chat-widget .brand-header span {
            font-size: 18px;
            font-weight: 500;
            color: var(--chat--color-font);
        }

        .n8n-chat-widget .new-conversation {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            padding: 20px;
            text-align: center;
            width: 100%;
            max-width: 300px;
        }

        .n8n-chat-widget .welcome-text {
            font-size: 24px;
            font-weight: 600;
            color: var(--chat--color-font);
            margin-bottom: 24px;
            line-height: 1.3;
        }

        .n8n-chat-widget .new-chat-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            width: 100%;
            padding: 16px 24px;
            background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
            transition: transform 0.3s;
            font-weight: 500;
            font-family: inherit;
            margin-bottom: 12px;
        }

        .n8n-chat-widget .new-chat-btn:hover {
            transform: scale(1.02);
        }

        .n8n-chat-widget .message-icon {
            width: 20px;
            height: 20px;
        }

        .n8n-chat-widget .response-text {
            font-size: 14px;
            color: var(--chat--color-font);
            opacity: 0.7;
            margin: 0;
        }

        .n8n-chat-widget .chat-interface {
            display: none;
            flex-direction: column;
            height: 100%;
        }

        .n8n-chat-widget .chat-interface.active {
            display: flex;
        }

        .n8n-chat-widget .chat-messages {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
            background: var(--chat--color-background);
            display: flex;
            flex-direction: column;
        }

        .n8n-chat-widget .chat-message {
            padding: 12px 16px;
            margin: 8px 0;
            border-radius: 12px;
            max-width: 80%;
            word-wrap: break-word;
            font-size: 14px;
            line-height: 1.5;
        }

        .n8n-chat-widget .chat-message.user {
            background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
            color: white;
            align-self: flex-end;
            box-shadow: 0 4px 12px rgba(133, 79, 255, 0.2);
            border: none;
        }

        .n8n-chat-widget .chat-message.bot {
            background: var(--chat--color-background);
            border: 1px solid rgba(133, 79, 255, 0.2);
            color: var(--chat--color-font);
            align-self: flex-start;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        .n8n-chat-widget .chat-input {
            padding: 16px;
            background: var(--chat--color-background);
            border-top: 1px solid rgba(133, 79, 255, 0.1);
            display: flex;
            gap: 8px;
            align-items: stretch;
        }

        .n8n-chat-widget .chat-input textarea {
            flex: 1;
            padding: 12px;
            border: 1px solid rgba(133, 79, 255, 0.2);
            border-radius: 8px;
            background: var(--chat--color-background);
            color: var(--chat--color-font);
            resize: none;
            font-family: inherit;
            font-size: 14px;
            height: 40px !important;
            min-height: 40px !important;
            max-height: 40px !important;
            box-sizing: border-box;
        }

        .n8n-chat-widget .chat-input textarea::placeholder {
            color: var(--chat--color-font);
            opacity: 0.6;
        }

        .n8n-chat-widget .chat-input button {
            background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
            color: white;
            border: none;
            border-radius: 8px;
            padding: 0 20px;
            cursor: pointer;
            transition: transform 0.2s;
            font-family: inherit;
            font-weight: 500;
            height: 40px !important;
            min-width: 80px;
            box-sizing: border-box;
            margin-left: 8px;
        }

        .n8n-chat-widget .chat-input button:hover {
            transform: scale(1.05);
        }

        .n8n-chat-widget .chat-toggle {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 60px;
            height: 60px;
            border-radius: 30px;
            background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
            color: white;
            border: none;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(133, 79, 255, 0.3);
            z-index: 999;
            transition: transform 0.3s;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .n8n-chat-widget .chat-toggle.position-left {
            right: auto;
            left: 20px;
        }

        .n8n-chat-widget .chat-toggle:hover {
            transform: scale(1.05);
        }

        .n8n-chat-widget .chat-toggle svg {
            width: 24px;
            height: 24px;
            fill: currentColor;
        }

        .n8n-chat-widget .chat-footer {
            padding: 8px;
            text-align: center;
            background: var(--chat--color-background);
            border-top: 1px solid rgba(133, 79, 255, 0.1);
        }

        .n8n-chat-widget .chat-footer a {
            color: var(--chat--color-primary);
            text-decoration: none;
            font-size: 12px;
            opacity: 0.8;
            transition: opacity 0.2s;
            font-family: inherit;
        }

        .n8n-chat-widget .chat-footer a:hover {
            opacity: 1;
        }

        @keyframes blink { 
            0%, 80% { opacity: .2; }
            40% { opacity: 1; }
        }
        .typing-indicator {
            display: flex;
            align-items: center;
            gap: 4px;
            padding: 8px 12px;
            background: var(--chat--color-light);
            border-radius: var(--chat--border-radius);
            margin: 8px 0;
        }
        .typing-indicator span {
            display: inline-block;
            width: 6px;
            height: 6px;
            background: var(--chat--color-typing);
            border-radius: 50%;
            animation: blink 1.4s infinite;
        }
        .typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
        .typing-indicator span:nth-child(3) { animation-delay: 0.4s; }
    `;

  // Load Geist font
  const fontLink = document.createElement("link");
  fontLink.rel = "stylesheet";
  fontLink.href =
    "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap";
  document.head.appendChild(fontLink);

  // Inject styles
  const styleSheet = document.createElement("style");
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);

  // Default configuration
  const defaultConfig = {
    webhook: {
      url: "",
      route: "",
      headers: {
        "Content-Type": "application/json",
      },
    },
    branding: {
      logo: "",
      name: "",
      welcomeText: "",
      responseTimeText: "",
      initialMessage: "",
      placeholder: "",
      sendButtonText: "",
      startButtonText: "",
      closeButtonText: "",
    },
    style: {
      primaryColor: "",
      secondaryColor: "",
      position: "right",
      backgroundColor: "#ffffff",
      fontColor: "#333333",
      borderRadius: "12px",
      chatWidth: "380px",
      chatHeight: "600px",
      fontSize: "14px",
      messageSpacing: "8px",
      headerHeight: "64px",
      inputHeight: "72px",
      toggleButtonSize: "60px",
      enableTypingAnimation: true,
      typingAnimationColor: "#333333",
      typingAnimationDuration: "1.5s",
      typingAnimationDots: 3,
      bottomSpacing: "20px",
      sideSpacing: "20px",
    },
    behavior: {
      autoOpen: true,
      enableMarkdown: true,
      enableEnterToSend: true,
      enableShiftEnter: true,
      scrollToBottom: true,
      showPoweredBy: false,
      showCloseButton: true,
      showStartButton: true,
      showTypingIndicator: true,
      markdownOptions: {
        breaks: true,
        gfm: true,
        tables: true,
        sanitize: false,
        smartLists: true,
        smartypants: true,
      },
      messageOptions: {
        showTimestamp: true,
        timestampFormat: "HH:mm",
        showAvatar: true,
        showName: true,
      },
      errorHandling: {
        showErrorMessages: true,
        retryOnError: true,
        maxRetries: 3,
      },
    },
    events: {
      onOpen: function () {},
      onClose: function () {},
      onMessage: function () {},
      onError: function () {},
    },
  };

  // Merge user config with defaults
  const config = window.ChatWidgetConfig
    ? {
        // Prend les propriétés au niveau racine
        ...window.ChatWidgetConfig,
        // Fusionne les sous-objets
        webhook: {
          ...defaultConfig.webhook,
          ...(window.ChatWidgetConfig.webhook || {}),
        },
        branding: {
          ...defaultConfig.branding,
          ...(window.ChatWidgetConfig.branding || {}),
          // Prend les propriétés au niveau racine si elles existent
          initialMessage:
            window.ChatWidgetConfig.initialMessage ||
            defaultConfig.branding.initialMessage,
          placeholder:
            window.ChatWidgetConfig.placeholder ||
            defaultConfig.branding.placeholder,
          sendButtonText:
            window.ChatWidgetConfig.sendButtonText ||
            defaultConfig.branding.sendButtonText,
          startButtonText:
            window.ChatWidgetConfig.startButtonText ||
            defaultConfig.branding.startButtonText,
          closeButtonText:
            window.ChatWidgetConfig.closeButtonText ||
            defaultConfig.branding.closeButtonText,
        },
        style: {
          ...defaultConfig.style,
          ...(window.ChatWidgetConfig.style || {}),
        },
        behavior: {
          ...defaultConfig.behavior,
          ...(window.ChatWidgetConfig.behavior || {}),
        },
      }
    : defaultConfig;

  // Prevent multiple initializations
  if (window.N8NChatWidgetInitialized) return;
  window.N8NChatWidgetInitialized = true;

  let currentSessionId = "";

  // Create widget container
  const widgetContainer = document.createElement("div");
  widgetContainer.className = "n8n-chat-widget";

  // Set CSS variables for colors
  widgetContainer.style.setProperty(
    "--n8n-chat-primary-color",
    config.style.primaryColor
  );
  widgetContainer.style.setProperty(
    "--n8n-chat-secondary-color",
    config.style.secondaryColor
  );
  widgetContainer.style.setProperty(
    "--n8n-chat-background-color",
    config.style.backgroundColor
  );
  widgetContainer.style.setProperty(
    "--n8n-chat-font-color",
    config.style.fontColor
  );

  const chatContainer = document.createElement("div");
  chatContainer.className = `chat-container${
    config.style.position === "left" ? " position-left" : ""
  }`;

  chatContainer.style.width = config.style.chatWidth;
  chatContainer.style.height = config.style.chatHeight;
  chatContainer.style.borderRadius = config.style.borderRadius;

  const newConversationHTML = `
        <div class="brand-header">
            <img src="${config.branding.logo}" alt="${config.branding.name}">
            <span>${config.branding.name}</span>
            <button class="close-button">×</button>
        </div>
        <div class="new-conversation">
            <h2 class="welcome-text">${config.branding.welcomeText}</h2>
            <button class="new-chat-btn">
                <svg class="message-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.2L4 17.2V4h16v12z"/>
                </svg>
                ${config.branding.startButtonText || "Démarrer"}
            </button>
            <p class="response-text">${config.branding.responseTimeText}</p>
        </div>
    `;

  const chatInterfaceHTML = `
        <div class="chat-interface">
            <div class="brand-header">
                <img src="${config.branding.logo}" alt="${
    config.branding.name
  }">
                <span>${config.branding.name}</span>
                <button class="close-button">×</button>
            </div>
            <div class="chat-messages"></div>
            <div class="chat-input">
                <textarea placeholder="${
                  config.branding.placeholder || "Votre message..."
                }" rows="1" style="height: ${
    config.style.inputHeight
  };"></textarea>
                <button type="submit">${
                  config.branding.sendButtonText || "Envoyer"
                }</button>
            </div>
        </div>
    `;

  chatContainer.innerHTML = newConversationHTML + chatInterfaceHTML;

  const toggleButton = document.createElement("button");
  toggleButton.className = `chat-toggle${
    config.style.position === "left" ? " position-left" : ""
  }`;
  toggleButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M12 2C6.477 2 2 6.477 2 12c0 1.821.487 3.53 1.338 5L2.5 21.5l4.5-.838A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.476 0-2.886-.313-4.156-.878l-3.156.586.586-3.156A7.962 7.962 0 014 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z"/>
        </svg>`;

  widgetContainer.appendChild(chatContainer);
  widgetContainer.appendChild(toggleButton);
  document.body.appendChild(widgetContainer);

  const newChatBtn = chatContainer.querySelector(".new-chat-btn");
  const chatInterface = chatContainer.querySelector(".chat-interface");
  const messagesContainer = chatContainer.querySelector(".chat-messages");
  const textarea = chatContainer.querySelector("textarea");
  const sendButton = chatContainer.querySelector('button[type="submit"]');

  function generateUUID() {
    return crypto.randomUUID();
  }

  async function startNewConversation() {
    currentSessionId = generateUUID();
    const data = [
      {
        action: "loadPreviousSession",
        sessionId: currentSessionId,
        route: config.webhook.route,
        metadata: { userId: "" },
      },
    ];

    try {
      const response = await fetch(config.webhook.url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      // Afficher d'abord le message initial
      messagesContainer.innerHTML = "";
      if (config.branding.initialMessage) {
        const initialMessage = document.createElement("div");
        initialMessage.className = "chat-message bot";
        initialMessage.innerHTML = renderMarkdown(
          config.branding.initialMessage
        );
        messagesContainer.appendChild(initialMessage);
      }

      // Ensuite changer l'interface
      chatContainer.querySelector(".brand-header").style.display = "none";
      chatContainer.querySelector(".new-conversation").style.display = "none";
      chatInterface.classList.add("active");
    } catch (error) {
      console.error("Error:", error);
    }
  }

  function scrollToBottom() {
    if (config.behavior.scrollToBottom) {
      requestAnimationFrame(() => {
        messagesContainer.scrollTo({
          top: messagesContainer.scrollHeight,
          behavior: "smooth",
        });
      });
    }
  }

  async function sendMessage(message) {
    let retryCount = 0;
    const maxRetries = config.behavior.errorHandling?.maxRetries || 3;

    while (retryCount < maxRetries) {
      try {
        if (config.events.onMessage) {
          config.events.onMessage(message);
        }
        const messageData = {
          action: "sendMessage",
          sessionId: currentSessionId,
          route: config.webhook.route,
          chatInput: message,
          metadata: {
            userId: "",
          },
        };

        const userMessageDiv = document.createElement("div");
        userMessageDiv.className = "chat-message user";
        userMessageDiv.textContent = message;
        messagesContainer.appendChild(userMessageDiv);
        scrollToBottom();

        // Ajouter l'indicateur de typing
        if (config.behavior.showTypingIndicator) {
          const typingDiv = document.createElement("div");
          typingDiv.className = "typing-indicator";
          typingDiv.innerHTML = "<span></span><span></span><span></span>";
          messagesContainer.appendChild(typingDiv);
          scrollToBottom();
        }

        // Créer le message du bot avant de recevoir la réponse
        const botMessageDiv = document.createElement("div");
        botMessageDiv.className = "chat-message bot";
        messagesContainer.appendChild(botMessageDiv);

        // Lire la réponse en streaming
        const reader = response.body.getReader();
        let decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          let output = Array.isArray(data) ? data[0].output : data.output;
          if (typeof output === "object") output = output.output; // Si jamais c'est encore un objet
          botMessageDiv.innerHTML = renderMarkdown(output);
          scrollToBottom();
        }

        break; // Si succès, sort de la boucle
      } catch (error) {
        retryCount++;
        if (config.events.onError) {
          config.events.onError(error);
        }
        if (
          retryCount === maxRetries ||
          !config.behavior.errorHandling?.retryOnError
        ) {
          if (config.behavior.errorHandling?.showErrorMessages) {
            const errorMessage = document.createElement("div");
            errorMessage.className = "chat-message error";
            errorMessage.textContent =
              "Une erreur est survenue. Veuillez réessayer.";
            messagesContainer.appendChild(errorMessage);
          }
          break;
        }
        // Attendre avant de réessayer
        await new Promise((resolve) => setTimeout(resolve, 1000 * retryCount));
      }
    }
  }

  newChatBtn.addEventListener("click", startNewConversation);

  sendButton.addEventListener("click", () => {
    const message = textarea.value.trim();
    if (message) {
      sendMessage(message);
      textarea.value = "";
    }
  });

  textarea.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const message = textarea.value.trim();
      if (message) {
        sendMessage(message);
        textarea.value = "";
      }
    }
  });

  toggleButton.addEventListener("click", () => {
    if (config.events.onOpen) {
      config.events.onOpen();
    }
    chatContainer.classList.toggle("open");
  });

  // Add close button handlers
  const closeButtons = chatContainer.querySelectorAll(".close-button");
  closeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (config.events.onClose) {
        config.events.onClose();
      }
      chatContainer.classList.remove("open");
    });
  });

  // Apply additional styles
  textarea.placeholder = config.branding.placeholder || "Votre message...";
  textarea.style.height = config.style.inputHeight;
  sendButton.textContent = config.branding.sendButtonText || "Envoyer";
  newChatBtn.textContent = config.branding.startButtonText || "Démarrer";

  if (config.behavior.showTypingIndicator) {
    const typingIndicator = chatContainer.querySelector(".typing-indicator");
    typingIndicator.style.animationDuration =
      config.style.typingAnimationDuration;
  }

  function renderMarkdown(text) {
    if (!text) return "";

    if (config.behavior.enableMarkdown && typeof marked !== "undefined") {
      try {
        const options = {
          ...config.behavior.markdownOptions,
          headerIds: false,
          mangle: false,
          pedantic: false,
          gfm: true,
          breaks: true,
          sanitize: false,
          smartLists: true,
          smartypants: true,
          xhtml: false,
        };

        const cleanText = text.replace(/\\n/g, "\n").trim();
        return marked.parse(cleanText, options);
      } catch (error) {
        console.error("Markdown rendering error:", error);
        return text;
      }
    }
    return text;
  }
})();
