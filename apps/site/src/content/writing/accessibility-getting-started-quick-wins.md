---
title: 'Accessibility: getting started and quick wins'
description: 'Practical a11y starters: aria-label, keyboard access, semantic HTML, and landmarks.'
pubDate: '2023-06-25'
tags: ['accessibility']
source: 'https://dev.to/nevnet99/accessibility-getting-started-quick-wins-54o4'
archived: true
---

The reason I'm writing this blog post is due to the current way that accessibility at least in my experience is seen within tech companies. An afterthought or an oops yeah we should've done that at the start.

Accessibility is one of the topics, that for me is as important if not more important than testing (There is no point in testing something if it does not work for people who can only use a keyboard). But opinions aside there is a risk to bad accessibility and that is if whoever you're working for client or business asks we need to meet X standard there is either going to be a lot of refactoring or a complete remake of some components.

A couple of components to look out for are (although this is not a complete list that can be found [here](https://www.w3.org/TR/WCAG21/)).

- Tabbed views
- Accordions
- Fake buttons
- Buttons with no text (Icon buttons etc)
- Custom selects

Also, if you're looking to learn more semantic HTML learning accessibility in tandem is a really good idea as some semantic elements, for example, the interactive element `<dialog></dialog>` (we'll get into this in a bit).

In this post, I'm aiming to get you started or at least point you in the right direction when it comes to accessibility, so you can spot common errors before they force a major refactor.

## Aria Labels

An `aria-label` is an attribute for an HTML element that defines a label for the given element. It should be used when there is no visible text associated with an element. Aria labels should only be used on certain elements, don't go labeling everything!

- Interactive elements
- Landmark elements
- Elements that have an explicit widget role
- `iframe` and `img` elements (I don't think these need an explanation 🙂)

Let's expand on what some of these elements are.

### Interactive elements

Interactive elements consist of 4 HTML elements (blog post explaining how to use these coming soon! for now here's a link to some [docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Element#interactive_elements)!).

- `<details></details>`
- `<dialog></dialog>`
- `<menu></menu>`
- `<summary></summary>`

### Landmark elements

Landmark elements are a special kind of element; it could technically be any HTML element with the role set to a valid landmark value. A list of these is:

- `banner`: A region that contains the prime heading or internal title of a page.
- `complementary`: Any section of the document that supports the main content, yet is separate and meaningful on its own.
- `contentinfo`: A region that contains information about the parent document such as copyrights and links to privacy statements.
- `form`: A region of the document that represents a collection of form-associated elements, some of which can represent editable values that can be submitted to a server for processing.
- `main`: Main content in a document. In almost all cases, a page will have only one `role="main"`.
- `navigation`: A collection of links suitable for use when navigating the document or related documents.
- `search`: The search tool of a Web document.
- `application`: A region declared as a web application, as opposed to a web document.

### Elements with explicit widget role

Some elements have an explicit role that represents a specific widget or interactive component. These elements include:

- `<button>`
- `<input>`
- `<select>`
- `<textarea>`

For these elements, if they don't have visible text, you should provide an `aria-label` to ensure they are accessible.

### Examples of using `aria-label`

Let's take a look at a few examples of how to use `aria-label`:

1. Button with an icon:

   ```html
   <button aria-label="Add item">
     <i class="icon-add"></i>
   </button>
   ```

   In this example, the button has an icon but no visible text. The `aria-label` attribute provides an accessible label for screen readers.

2. Image with no alt text:

   ```html
   <img src="image.jpg" aria-label="Product image">
   ```

   When using an image without alt text, you can use the `aria-label` attribute to provide a description for screen reader users.

3. Custom select dropdown:

   ```html
   <div role="combobox" aria-label="Select a country" aria-expanded="false">
     <input type="text" aria-autocomplete="list">
     <ul role="listbox" aria-hidden="true">
       <li role="option">Option 1</li>
       <li role="option">Option 2</li>
       <li role="option">Option 3</li>
     </ul>
   </div>
   ```

   In this example, we have a custom select dropdown implemented using HTML and CSS. The `aria-label` attribute on the main container provides a label for the dropdown, and the `role` attributes on the child elements define their roles for accessibility.

By using `aria-label` appropriately, you can ensure that elements without visible text are still accessible to screen reader users.

## Keyboard Accessibility

Keyboard accessibility matters for anyone who navigates without a mouse, including people with motor disabilities. Points to cover:

1. **Focus Styles**: Ensure that interactive elements, such as links, buttons, and form inputs, have a visible focus indicator when they receive focus. This helps keyboard users understand their current location on the page.

2. **Tab Order**: Elements should follow a logical tab order that makes sense for keyboard users. By default, HTML elements are ordered based on their position in the HTML document. However, you can use the `tabindex` attribute to modify the tab order if needed.

3. **Keyboard Navigation**: Test your website using only the keyboard to ensure all interactive elements are reachable and operable. Users should be able to navigate through links, buttons, dropdown menus, and other interactive components using the keyboard alone.

4. **Skip Links**: Include a skip link at the beginning of your page to allow users to jump directly to the main content or other important sections. This helps keyboard users avoid repetitive navigation and quickly access the relevant content.

5. **Keyboard Traps**: Avoid creating keyboard traps where users get stuck in a particular focus state and cannot navigate away using the keyboard. For example, ensure that modals and overlays can be closed using the keyboard (e.g., pressing the Escape key).

Test keyboard interactions thoroughly. Keyboard-only users should be able to reach and leave every interactive control.

## Semantic HTML

Using semantic HTML is not only good for search engine optimization and code readability but also plays a significant role in accessibility. Semantic HTML elements convey meaning to assistive technologies and provide context for understanding the structure of a web page. Here are some examples of semantic HTML elements and their usage:

- `<header>`: Represents the introductory content or a group of navigational aids for a page or section.
- `<nav>`: Defines a section containing navigation links.
- `<main>`: Specifies the main content of a document.
- `<article>`: Represents a self-contained composition in a document.
- `<section>`: Defines a standalone section within a document.
- `<aside>`: Represents a section of a document with content related to the main content.
- `<footer>`: Defines the footer of a document or a section.
- `<figure>` and `<figcaption>`: Used together to encapsulate media content (such as images) and provide a caption.

By using these semantic elements, you provide additional context to assistive technologies and improve the accessibility of your website.

## ARIA Landmarks

ARIA landmarks are a set of roles that can be added to specific sections of a web page to help users navigate and understand its structure. Some common ARIA landmarks include:

- `role="banner"`: Marks the banner or header section of a page.
- `role="navigation"`: Identifies the section containing navigation links.
- `role="main"`: Marks the main content of a document.
- `role="complementary"`: Identifies a section that supports the main content but is not essential to its understanding.
- `role="contentinfo"`: Marks the footer or the end portion of a page, providing additional information about the document.

By using ARIA landmarks, you can enhance the navigation and comprehension of your web pages for screen reader users.

## Conclusion

Start with the quick wins above: explicit widget roles, `aria-label` where there is no visible text, keyboard access, semantic HTML, and ARIA landmarks. Then test with real users, including people who use assistive technology, and keep iterating. Accessibility works better when it is part of the build from day one, not a late remediation pass.
