
/*
 *  Copyright (C) 2017 Atelier Cartographique <contact@atelier-cartographique.be>
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, version 3 of the License.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import * as React from 'react';


interface HTMLTags {
    a: HTMLAnchorElement;
    abbr: HTMLElement;
    address: HTMLElement;
    area: HTMLAreaElement;
    article: HTMLElement;
    aside: HTMLElement;
    audio: HTMLAudioElement;
    b: HTMLElement;
    base: HTMLBaseElement;
    bdi: HTMLElement;
    bdo: HTMLElement;
    big: HTMLElement;
    blockquote: HTMLElement;
    body: HTMLBodyElement;
    br: HTMLBRElement;
    button: HTMLButtonElement;
    canvas: HTMLCanvasElement;
    caption: HTMLElement;
    cite: HTMLElement;
    code: HTMLElement;
    col: HTMLTableColElement;
    colgroup: HTMLTableColElement;
    data: HTMLElement;
    datalist: HTMLDataListElement;
    dd: HTMLElement;
    del: HTMLElement;
    details: HTMLElement;
    dfn: HTMLElement;
    dialog: HTMLElement;
    div: HTMLDivElement;
    dl: HTMLDListElement;
    dt: HTMLElement;
    em: HTMLElement;
    embed: HTMLEmbedElement;
    fieldset: HTMLFieldSetElement;
    figcaption: HTMLElement;
    figure: HTMLElement;
    footer: HTMLElement;
    form: HTMLFormElement;
    h1: HTMLHeadingElement;
    h2: HTMLHeadingElement;
    h3: HTMLHeadingElement;
    h4: HTMLHeadingElement;
    h5: HTMLHeadingElement;
    h6: HTMLHeadingElement;
    head: HTMLElement;
    header: HTMLElement;
    hgroup: HTMLElement;
    hr: HTMLHRElement;
    html: HTMLHtmlElement;
    i: HTMLElement;
    iframe: HTMLIFrameElement;
    img: HTMLImageElement;
    input: HTMLInputElement;
    ins: HTMLModElement;
    kbd: HTMLElement;
    keygen: HTMLElement;
    label: HTMLLabelElement;
    legend: HTMLLegendElement;
    li: HTMLLIElement;
    link: HTMLLinkElement;
    main: HTMLElement;
    map: HTMLMapElement;
    mark: HTMLElement;
    menu: HTMLElement;
    menuitem: HTMLElement;
    meta: HTMLMetaElement;
    meter: HTMLElement;
    nav: HTMLElement;
    noscript: HTMLElement;
    object: HTMLObjectElement;
    ol: HTMLOListElement;
    optgroup: HTMLOptGroupElement;
    option: HTMLOptionElement;
    output: HTMLElement;
    p: HTMLParagraphElement;
    param: HTMLParamElement;
    picture: HTMLElement;
    pre: HTMLPreElement;
    progress: HTMLProgressElement;
    q: HTMLQuoteElement;
    rp: HTMLElement;
    rt: HTMLElement;
    ruby: HTMLElement;
    s: HTMLElement;
    samp: HTMLElement;
    script: HTMLScriptElement;
    section: HTMLElement;
    select: HTMLSelectElement;
    small: HTMLElement;
    source: HTMLSourceElement;
    span: HTMLSpanElement;
    strong: HTMLElement;
    style: HTMLStyleElement;
    sub: HTMLElement;
    summary: HTMLElement;
    sup: HTMLElement;
    table: HTMLTableElement;
    tbody: HTMLTableSectionElement;
    td: HTMLTableDataCellElement;
    textarea: HTMLTextAreaElement;
    tfoot: HTMLTableSectionElement;
    th: HTMLTableHeaderCellElement;
    thead: HTMLTableSectionElement;
    time: HTMLElement;
    title: HTMLTitleElement;
    tr: HTMLTableRowElement;
    track: HTMLTrackElement;
    u: HTMLElement;
    ul: HTMLUListElement;
    var: HTMLElement;
    video: HTMLVideoElement;
    wbr: HTMLElement;
}

const factory = <K extends keyof React.ReactHTML>(k: K) => {
    return React.createFactory<HTMLTags[K]>(k);
};


/**
 * generated from 
 * https://github.com/tylerjpeterson/html-element-list/blob/master/element-list.json
 * 
 * License: 
 * HTML element reference by Mozilla Contributors is licensed under CC-BY-SA 4.0 with modification.
 * 
 * The original unmodified material is available from https://developer.mozilla.org/en-US/docs/Web/HTML/Element
 */

// The HTML Background Sound Element () is an Internet Explorer element associating a background sound with a page.
// NOT SUPPORTED - export const BGSOUND = factory('bgsound');

// The HTML Code Element (code) represents a fragment of computer code. By default, it is displayed in the browser's default monospace font.
export const CODE = factory('code');

// The HTML `rtc` Element embraces semantic annotations of characters presented in a ruby of `rb` elements used inside of `ruby` element. `rb` elements can have both pronunciation (rt) and semantic (rtc) annotations.
// NOT SUPPORTED - export const RTC = factory('rtc');

// The HTML `meter` Element represents either a scalar value within a known range or a fractional value.
export const METER = factory('meter');

// The HTML Table Body Element (tbody) defines one or more `tr` element data-rows to be the body of its parent `table` element (as long as no `tr` elements are immediate children of that table element.)  In conjunction with a preceding `thead` and/or `tfoot` element, `tbody` provides additional semantic information for devices such as printers and displays. Of the parent table's child elements, `tbody` represents the content which, when longer than a page, will most likely differ for each page printed; while the content of `thead` and `tfoot` will be the same or similar for each page printed. For displays, `tbody` will enable separate scrolling of the `thead`, `tfoot`, and `caption` elements of the same parent `table` element.  Note that unlike the `thead`, `tfoot`, and `caption` elements however, multiple `tbody` elements are permitted (if consecutive), allowing the data-rows in long tables to be divided into different sections, each separately formatted as needed.
export const TBODY = factory('tbody');

// `spacer` is an HTML element which is used for inserting white spaces to web pages. It was created by NetScape for achieving same effect as a single-pixel layout GIF image, which was something web designers used to use to add white spaces to web pages, without actually using a GIF. However `spacer` is not supported by any major browser and same effects can be created with various CSS rules. In Mozilla applications, support for this element was removed in Gecko 2.0. Therefore usage of `spacer` is unnecessary.
// NOT SUPPORTED - export const SPACER = factory('spacer');

// The HTML Font Element (font) defines the font size, color and face for its content.
// NOT SUPPORTED - export const FONT = factory('font');

// The HTML `noscript` Element defines a section of html to be inserted if a script type on the page is unsupported or if scripting is currently turned off in the browser.
export const NOSCRIPT = factory('noscript');

// The HTML `style` element contains style information for a document, or part of a document. By default, the style instructions written inside that element are expected to be CSS.
export const STYLE = factory('style');

// The HTML `img` element represents an image in the document.
export const IMG = factory('img');

// The HTML `title` element defines the title of the document, shown in a browser's title bar or on the page's tab. It can only contain text, and any contained tags are ignored.
export const TITLE = factory('title');

// The HTML `menu` element represents a group of commands that a user can perform or activate. This includes both list menus, which might appear across the top of a screen, as well as context menus, such as those that might appear underneath a button after it has been clicked.
export const MENU = factory('menu');

// The HTML Teletype Text Element (tt) produces an inline element displayed in the browser's default monotype font. This element was intended to style text as it would display on a fixed width display, such as a teletype. It probably is more common to display fixed width type using the `code` element.
// NOT SUPPORTED - export const TT = factory('tt');

// The HTML element table row `tr` defines a row of cells in a table. Those can be a mix of `td` and `th` elements.
export const TR = factory('tr');

// The HTML `param` Element (or HTML Parameter Element) defines parameters for `object`.
export const PARAM = factory('param');

// The HTML `li` element (or HTML List Item Element) is used to represent an item in a list. It must be contained in a parent element: an ordered list (ol), an unordered list (ul), or a menu (menu). In menus and unordered lists, list items are usually displayed using bullet points. In ordered lists, they are usually displayed with an ascending counter on the left, such as a number or letter.
export const LI = factory('li');

// Editorial review completed.
export const SOURCE = factory('source');

// The HTML Table Foot Element (tfoot) defines a set of rows summarizing the columns of the table.
export const TFOOT = factory('tfoot');

// The HTML element table header cell `th` defines a cell as a header for a group of cells of a table. The group of cells that the header refers to is defined by the scope and headers attribute.
export const TH = factory('th');

// The HTML Listing Element (listing) renders text between the start and end tags without interpreting the HTML in between and using a monospaced font. The HTML 2 standard recommended that lines shouldn't be broken when not greater than 132 characters.
// NOT SUPPORTED - export const LISTING = factory('listing');

// The HTML element `input` is used to create interactive controls for web-based forms in order to accept data from the user. How an `input` works varies considerably depending on the value of its type attribute.
export const INPUT = factory('input');

// The Table cell HTML element (td) defines a cell of a table that contains data. It participates in the table model.
export const TD = factory('td');

// The HTML `main` element represents the main content of  the `body` of a document or application. The main content area consists of content that is directly related to, or expands upon the central topic of a document or the central functionality of an application. This content should be unique to the document, excluding any content that is repeated across a set of documents such as sidebars, navigation links, copyright information, site logos, and search forms (unless the document's main function is as a search form).
export const MAIN = factory('main');

// The HTML Example Element (xmp) renders text between the start and end tags without interpreting the HTML in between and using a monospaced font. The HTML2 specification recommended that it should be rendered wide enough to allow 80 characters per line.
// NOT SUPPORTED - export const XMP = factory('xmp');

// The HTML `dl` element (or HTML Description List Element) encloses a list of pairs of terms and descriptions. Common uses for this element are to implement a glossary or to display metadata (a list of key-value pairs).
export const DL = factory('dl');

// The HTML `blockquote` Element (or HTML Block Quotation Element) indicates that the enclosed text is an extended quotation. Usually, this is rendered visually by indentation (see Notes for how to change it). A URL for the source of the quotation may be given using the cite attribute, while a text representation of the source can be given using the `cite` element.
export const BLOCKQUOTE = factory('blockquote');

// The HTML `fieldset` element is used to group several controls as well as labels (label) within a web form.
export const FIELDSET = factory('fieldset');

// The HTML Big Element (big) makes the text font size one size bigger (for example, from small to medium, or from large to x-large) up to the browser's maximum font size.
export const BIG = factory('big');

// The HTML `dd` element (HTML Description Element) indicates the description of a term in a description list (dl) element. This element can occur only as a child element of a description list and it must follow a `dt` element.
export const DD = factory('dd');

// The HTML `nobr` element prevents a text from breaking into a new line automatically, so it is displayed on one long line and scrolling might be necessary. This tag is not standard HTML and should not be used.
// NOT SUPPORTED - export const NOBR = factory('nobr');

// The HTML Keyboard Input Element (kbd) represents user input and produces an inline element displayed in the browser's default monospace font.
export const KBD = factory('kbd');

// In a Web form, the HTML `optgroup` element  creates a grouping of options within a `select` element.
export const OPTGROUP = factory('optgroup');

// The HTML `dt` element (or HTML Definition Term Element) identifies a term in a definition list. This element can occur only as a child element of a `dl`. It is usually followed by a `dd` element; however, multiple `dt` elements in a row indicate several terms that are all defined by the immediate next `dd` element.
export const DT = factory('dt');

// The HTML `h5` element briefly describes the topic of the section it introduces.
export const H5 = factory('h5');

// The `noembed` element is a deprecated and non-standard way to provide alternative content for browsers that do not support the `embed` element or do not support embedded content an author wishes to use.
// NOT SUPPORTED - export const NOEMBED = factory('noembed');

// The HTML element word break opportunity `wbr` represents a position within text where the browser may optionally break a line, though its line-breaking rules would not otherwise create a break at that location.
export const WBR = factory('wbr');

// The HTML `marquee` element is used to insert a scrolling area of text.
// NOT SUPPORTED - export const MARQUEE = factory('marquee');

// The HTML `button` Element represents a clickable button.
export const BUTTON = factory('button');

// `isindex` is an obsolete HTML element that puts a text field in a page for querying the document.
// NOT SUPPORTED - export const ISINDEX = factory('isindex');

// The HTML summary element (summary) is used as a summary, caption, or legend for the content of a `details` element.
export const SUMMARY = factory('summary');

// The HTML `p` element (or HTML Paragraph Element) represents a paragraph of text.
export const P = factory('p');

// The HTML `menuitem` element represents a command that a user is able to invoke through a popup menu. This includes context menus, as well as menus that might be attached to a menu button.
export const MENUITEM = factory('menuitem');

// The HTML `output` element represents the result of a calculation or user action.
export const OUTPUT = factory('output');

// The HTML `div` element (or HTML Document Division Element) is the generic container for flow content, which does not inherently represent anything. It can be used to group elements for styling purposes (using the class or id attributes), or because they share attribute values, such as lang. It should be used only when no other semantic element (such as `article` or `nav) is appropriate.
export const DIV = factory('div');

// The HTML directory element (dir) represents a directory, namely a collection of filenames.
// NOT SUPPORTED - export const DIR = factory('dir');

// The HTML element emphasis  `em` marks text that has stress emphasis. The `em` element can be nested, with each level of nesting indicating a greater degree of emphasis.
export const EM = factory('em');

// The HTML `picture` element is a container used to specify multiple `source` elements for a specific `img` contained in it. The browser will choose the most suitable source according to the current layout of the page (the constraints of the box the image will appear in) and the device it will be displayed on (e.g. a normal or hiDPI device.)
export const PICTURE = factory('picture');

// The HTML Datalist Element (datalist) contains a set of `option` elements that represent the values available for other controls.
export const DATALIST = factory('datalist');

// `frame` is an HTML element which defines a particular area in which another HTML document can be displayed. A frame should be used within a `frameset`.
// NOT SUPPORTED - export const FRAME = factory('frame');

// The HTML `hgroup` Element (HTML Headings Group Element) represents the heading of a section. It defines a single title that participates in the outline of the document as the heading of the implicit or explicit section that it belongs to.
export const HGROUP = factory('hgroup');

// The HTML `meta` element represents any metadata information that cannot be represented by one of the other HTML meta-related elements (base`, `link`, `script`, `style` or `title).
export const META = factory('meta');

// Editorial review completed.
export const VIDEO = factory('video');

// The HTML `rt` Element embraces pronunciation of characters presented in a ruby annotations, which are used to describe the pronunciation of East Asian characters. This element is always used inside a `ruby` element.
export const RT = factory('rt');

// The HTML `canvas` Element can be used to draw graphics via scripting (usually JavaScript). For example, it can be used to draw graphs, make photo compositions or even perform animations. You may (and should) provide alternate content inside the `canvas` block. That content will be rendered both on older browsers that don't support canvas and in browsers with JavaScript disabled.
export const CANVAS = factory('canvas');

// The HTML `rp` element is used to provide fall-back parenthesis for browsers non-supporting ruby annotations. Ruby annotations are for showing pronounciation of East Asian characters, like using Japanese furigana or Taiwainese bopomofo characters. The `rp` element is used in the case of lack of `ruby` element support its content has what should be displayed in order to indicate the presence of a ruby annotation, usually parentheses.
export const RP = factory('rp');

// The HTML Subscript Element (sub) defines a span of text that should be displayed, for typographic reasons, lower, and often smaller, than the main span of text.
export const SUB = factory('sub');

// The HTML `bdo` Element (or HTML bidirectional override element) is used to override the current directionality of text. It causes the directionality of the characters to be ignored in favor of the specified directionality.
export const BDO = factory('bdo');

// The HTML `bdi` Element (or Bi-Directional Isolation Element) isolates a span of text that might be formatted in a different direction from other text outside it.
export const BDI = factory('bdi');

// The HTML Label Element (label) represents a caption for an item in a user interface. It can be associated with a control either by placing the control element inside the `label` element, or by using the for attribute. Such a control is called the labeled control of the label element. One input can be associated with multiple labels.
export const LABEL = factory('label');

// The HTML `content` element is used inside of Shadow DOM as an insertion point. It is not intended to be used in ordinary HTML. It is used with Web Components. It has now been replaced by the `slot` element.
// NOT SUPPORTED - export const CONTENT = factory('content');

// The HTML Acronym Element (acronym) allows authors to clearly indicate a sequence of characters that compose an acronym or abbreviation for a word.
// NOT SUPPORTED - export const ACRONYM = factory('acronym');

// The HTML template element `template` is a mechanism for holding client-side content that is not to be rendered when a page is loaded but may subsequently be instantiated during runtime using JavaScript.
// NOT SUPPORTED - export const TEMPLATE = factory('template');

// The HTML Superscript Element (sup) defines a span of text that should be displayed, for typographic reasons, higher, and often smaller, than the main span of text.
export const SUP = factory('sup');

// The HTML `progress` Element is used to view the completion progress of a task. While the specifics of how it's displayed is left up to the browser developer, it's typically displayed as a progress bar. Javascript can be used to manipulate the value of progress bar.
export const PROGRESS = factory('progress');

// The HTML `body` Element represents the content of an HTML document. There can be only one `body` element in a document.
export const BODY = factory('body');

// The HTML basefont element (basefont) establishes a default font size for a document. Font size then can be varied relative to the base font size using the `font` element.
// NOT SUPPORTED - export const BASEFONT = factory('basefont');

// The HTML Small Element (small) makes the text font size one size smaller (for example, from large to medium, or from small to x-small) down to the browser's minimum font size.  In HTML5, this element is repurposed to represent side-comments and small print, including copyright and legal text, independent of its styled presentation.
export const SMALL = factory('small');

// The HTML `base` element specifies the base URL to use for all relative URLs contained within a document. There can be only one `base` element in a document.
export const BASE = factory('base');

// The HTML element line break `br` produces a line break in text (carriage-return). It is useful for writing a poem or an address, where the division of lines is significant.
export const BR = factory('br');

// The HTML `address` element supplies contact information for its nearest `article` or `body` ancestor; in the latter case, it applies to the whole document.
export const ADDRESS = factory('address');

// The HTML `article` element represents a self-contained composition in a document, page, application, or site, which is intended to be independently distributable or reusable (e.g., in syndication). This could be a forum post, a magazine or newspaper article, a blog entry, an object, or any other independent item of content. Each `article` should be identified, typically by including a heading (h1`-`h6` element) as a child of the `article` element.
export const ARTICLE = factory('article');

// The HTML Strong Element (strong) gives text strong importance, and is typically displayed in bold.
export const STRONG = factory('strong');

// The HTML `legend` Element (or HTML Legend Field Element) represents a caption for the content of its parent `fieldset`.
export const LEGEND = factory('legend');

// The HTML `ol` Element (or HTML Ordered List Element) represents an ordered list of items. Typically, ordered-list items are displayed with a preceding numbering, which can be of any form, like numerals, letters or Romans numerals or even simple bullets. This numbered style is not defined in the HTML description of the page, but in its associated CSS, using the list-style-type property.
export const OL = factory('ol');

// The HTML Script Element (script) is used to embed or reference an executable script within an HTML or XHTML document.
export const SCRIPT = factory('script');

// The HTML `caption` Element (or HTML Table Caption Element) represents the title of a table. Though it is always the first descendant of a `table`, its styling, using CSS, may place it elsewhere, relative to the table.
export const CAPTION = factory('caption');

// The HTML Strikethrough Element (s) renders text with a strikethrough, or a line through it. Use the `s` element to represent things that are no longer relevant or no longer accurate. However, `s` is not appropriate when indicating document edits; for that, use the `del` and `ins` elements, as appropriate.
export const S = factory('s');

// The HTML `dialog` element represents a dialog box or other interactive component, such as an inspector or window.
export const DIALOG = factory('dialog');

// The HTML Table Column Element (col) defines a column within a table and is used for defining common semantics on all common cells. It is generally found within a `colgroup` element.
export const COL = factory('col');

// The HTML `h2` element briefly describes the topic of the section it introduces.
export const H2 = factory('h2');

// The HTML `h3` element briefly describes the topic of the section it introduces.
export const H3 = factory('h3');

// The HTML `image` element was an experimental element designed to display pictures. It never was implemented and the standard `img` element must be used.
// export const IMAGE = factory('image');

// The HTML `h1` element briefly describes the topic of the section it introduces.
export const H1 = factory('h1');

// The HTML `h6` element briefly describes the topic of the section it introduces.
export const H6 = factory('h6');

// The HTML `h4` element briefly describes the topic of the section it introduces.
export const H4 = factory('h4');

// The HTML Blink Element (blink) is a non-standard element causing the enclosed text to flash slowly.
// NOT SUPPORTED - export const BLINK = factory('blink');

// The HTML `header` element represents a group of introductory or navigational aids. It may contain some heading elements but also other elements like a logo, wrapped section's header, a search form, and so on.
export const HEADER = factory('header');

// The HTML Table Element (table) represents tabular data: information expressed via two dimensions or more.
export const TABLE = factory('table');

// The HTML select (select) element represents a control that presents a menu of options. The options within the menu are represented by `option` elements, which can be grouped by `optgroup` elements. Options can be pre-selected for the user.
export const SELECT = factory('select');

// `noframes` is an HTML element which is used to supporting browsers which are not able to support `frame` elements or configured to do so.
// NOT SUPPORTED - export const NOFRAMES = factory('noframes');

// The HTML `span` element is a generic inline container for phrasing content, which does not inherently represent anything. It can be used to group elements for styling purposes (using the class or id attributes), or because they share attribute values, such as lang.
export const SPAN = factory('span');

// The HTML `area` element defines a hot-spot region on an image, and optionally associates it with a hypertext link. This element is used only within a `map` element.
export const AREA = factory('area');

// The HTML Mark Element (mark) represents highlighted text, i.e., a run of text marked for reference purpose, due to its relevance in a particular context. For example it can be used in a page showing search results to highlight every instance of the searched-for word.
export const MARK = factory('mark');

// The HTML Definition Element (dfn) represents the defining instance of a term.
export const DFN = factory('dfn');

// The HTML Strikethrough Element (strike) renders text with a strikethrough, or a line through it.
// NOT SUPPORTED - export const STRIKE = factory('strike');

// The HTML Citation Element (cite) represents a reference to a creative work. It must include the title of a work or a URL reference, which may be in an abbreviated form according to the conventions used for the addition of citation metadata.
export const CITE = factory('cite');

// The HTML Table Head Element (thead) defines a set of rows defining the head of the columns of the table.
export const THEAD = factory('thead');

// The HTML `head` element provides general information (metadata) about the document, including its title and links to/definitions of scripts and style sheets.
export const HEAD = factory('head');

// In a Web form, the HTML `option` element is used to create a control representing an item within a `select`, an `optgroup` or a `datalist` HTML5 element.
export const OPTION = factory('option');

// The HTML `form` element represents a document section that contains interactive controls to submit information to a web server.
export const FORM = factory('form');

// The HTML `hr` element represents a thematic break between paragraph-level elements (for example, a change of scene in a story, or a shift of topic with a section). In previous versions of HTML, it represented a horizontal rule. It may still be displayed as a horizontal rule in visual browsers, but is now defined in semantic terms, rather than presentational terms.
export const HR = factory('hr');

// The HTML Variable Element (var) represents a variable in a mathematical expression or a programming context.
export const VAR = factory('var');

// The HTML `link` element specifies relationships between the current document and an external resource. Possible uses for this element include defining a relational framework for navigation. This Element is most used to link to style sheets.
export const LINK = factory('link');

// The HTML `ruby` Element represents a ruby annotation. Ruby annotations are for showing pronunciation of East Asian characters.
export const RUBY = factory('ruby');

// The HTML `b` Element represents a span of text stylistically different from normal text, without conveying any special importance or relevance. It is typically used for keywords in a summary, product names in a review, or other spans of text whose typical presentation would be boldfaced. Another example of its use is to mark the lead sentence of each paragraph of an article.
export const B = factory('b');

// The HTML Table Column Group Element (colgroup) defines a group of columns within a table.
export const COLGROUP = factory('colgroup');

// The HTML `keygen` element exists to facilitate generation of key material, and submission of the public key as part of an HTML form. This mechanism is designed for use with Web-based certificate management systems. It is expected that the `keygen` element will be used in an HTML form along with other information needed to construct a certificate request, and that the result of the process will be a signed certificate.
export const KEYGEN = factory('keygen');

// The HTML `ul` element (or HTML Unordered List Element) represents an unordered list of items, namely a collection of items that do not have a numerical ordering, and their order in the list is meaningless. Typically, unordered-list items are displayed with a bullet, which can be of several forms, like a dot, a circle or a squared. The bullet style is not defined in the HTML description of the page, but in its associated CSS, using the list-style-type property.
export const UL = factory('ul');

// The HTML Applet Element (applet) identifies the inclusion of a Java applet.
// NOT SUPPORTED - export const APPLET = factory('applet');

// The HTML Deleted Text Element (del) represents a range of text that has been deleted from a document. This element is often (but need not be) rendered with strike-through text.
export const DEL = factory('del');

// The HTML Inline Frame Element (iframe) represents a nested browsing context, effectively embedding another HTML page into the current page. In HTML 4.01, a document may contain a head and a body or a head and a frame-set, but not both a body and a frame-set. However, an `iframe` can be used within a normal document body. Each browsing context has its own session history and active document. The browsing context that contains the embedded content is called the parent browsing context. The top-level browsing context (which has no parent) is typically the browser window.
export const IFRAME = factory('iframe');

// The HTML `embed` Element represents an integration point for an external application or interactive content (in other words, a plug-in).
export const EMBED = factory('embed');

// The HTML `pre` element (or HTML Preformatted Text) represents preformatted text. Text within this element is typically displayed in a non-proportional (monospace) font exactly as it is laid out in the file.
export const PRE = factory('pre');

// `frameset` is an HTML element which is used to contain `frame` elements.
// NOT SUPPORTED - export const FRAMESET = factory('frameset');

// The HTML `figure` element represents self-contained content, frequently with a caption (figcaption), and is typically referenced as a single unit. While it is related to the main flow, its position is independent of the main flow. Usually this is an image, an illustration, a diagram, a code snippet, or a schema that is referenced in the main text, but that can be moved to another page or to an appendix without affecting the main flow.
export const FIGURE = factory('figure');

// The HTML Plaintext Element (plaintext) renders everything following the start tag as raw text, without interpreting any HTML. There is no closing tag, since everything after it is considered raw text.
// NOT SUPPORTED - export const PLAINTEXT = factory('plaintext');

// The HTML `ins` Element (or HTML Inserted Text) HTML represents a range of text that has been added to a document.
export const INS = factory('ins');

// The HTML `multicol` element was an experimental element designed to allow multi-column layouts. It never got any significant traction and is not implemented in any major browsers.
// NOT SUPPORTED - export const MULTICOL = factory('multicol');

// The HTML `aside` element represents a section of the page with content connected tangentially to the rest, which could be considered separate from that content. These sections are often represented as sidebars or inserts. They often contain the definitions on the sidebars, such as definitions from the glossary; there may also be other types of information, such as related advertisements; the biography of the author; web applications; profile information or related links on the blog.
export const ASIDE = factory('aside');

// The HTML `html` element (or HTML root element) represents the root of an HTML document. All other elements must be descendants of this element.
export const HTML = factory('html');

// The HTML `nav` element (HTML Navigation Element) represents a section of a page that links to other pages or to parts within the page: a section with navigation links.
export const NAV = factory('nav');

// The HTML Details Element (details) is used as a disclosure widget from which the user can retrieve additional information.
export const DETAILS = factory('details');

// The HTML Underline Element (u) renders text with an underline, a line under the baseline of its content.
export const U = factory('u');

// The HTML `shadow` element is used as a shadow DOM insertion point. You might use it if you have created multiple shadow roots under a shadow host. It is not useful in ordinary HTML. It is used with Web Components.
// NOT SUPPORTED - export const SHADOW = factory('Shadow');

// The HTML `samp` element is an element intended to identify sample output from a computer program. It is usually displayed in the browser's default monotype font (such as Lucida Console).
export const SAMP = factory('samp');

// The HTML `map` element is used with `area` elements to define an image map (a clickable link area).
export const MAP = factory('map');

// The HTML `track` element is used as a child of the media elements—`audio` and `video`. It lets you specify timed text tracks (or time-based data), for example to automatically handle subtitles. The tracks are formatted in WebVTT format (.vtt files) — Web Video Text Tracks.
export const TRACK = factory('track');

// The HTML Embedded Object Element (object) represents an external resource, which can be treated as an image, a nested browsing context, or a resource to be handled by a plugin.
export const OBJECT = factory('object');

// The HTML `figcaption` element represents a caption or a legend associated with a figure or an illustration described by the rest of the data of the `figure` element which is its immediate ancestor which means `figcaption` can be the first or last element inside a `figure` block. Also, the HTML Figcaption Element is optional; if not provided, then the parent figure element will have no caption.
export const FIGCAPTION = factory('figcaption');

// The HTML `data` Element links a given content with a machine-readable translation. If the content is time- or date-related, the `time` must be used.
export const DATA = factory('data');

// The HTML Anchor Element (a) defines a hyperlink to a location on the same page or any other page on the Web. It can also be used (in an obsolete way) to create an anchor point—a destination for hyperlinks within the content of a page, so that links aren't limited to connecting simply to the top of a page.
export const A = factory('a');

// The HTML Center Element (center) is a block-level element that can contain paragraphs and other block-level and inline elements. The entire content of this element is centered horizontally within its containing element (typically, the `body).
// NOT SUPPORTED - export const CENTER = factory('center');

// The HTML `textarea` element represents a multi-line plain-text editing control.
export const TEXTAREA = factory('textarea');

// The HTML `footer` element represents a footer for its nearest sectioning content or sectioning root element. A footer typically contains information about the author of the section, copyright data or links to related documents.
export const FOOTER = factory('footer');

// The HTML `i` Element represents a range of text that is set off from the normal text for some reason, for example, technical terms, foreign language phrases, or fictional character thoughts. It is typically displayed in italic type.
export const I = factory('i');

// The HTML `element` element is used to define new custom DOM elements.
// NOT SUPPORTED - export const ELEMENT = factory('element');

// The HTML Quote Element (q) indicates that the enclosed text is a short inline quotation. This element is intended for short quotations that don't require paragraph breaks; for long quotations use `blockquote` element.
export const Q = factory('q');

// The command element represents a command which the user can invoke.
// NOT SUPPORTED - export const COMMAND = factory('command');

// Technical review completed.
export const TIME = factory('time');

// The HTML `audio` element is used to embed sound content in documents. It may contain one or more audio sources, represented using the src attribute or the `source` element; the browser will choose the most suitable one.
export const AUDIO = factory('audio');

// The HTML `section` element represents a generic section of a document, i.e., a thematic grouping of content, typically with a heading. Each `section` should be identified, typically by including a heading (h1`-`h6` element) as a child of the `section` element.
export const SECTION = factory('section');

// The HTML `abbr` element (or HTML Abbreviation Element) represents an abbreviation and optionally provides a full description for it. If present, the title attribute must contain this full description and nothing else.
export const ABBR = factory('abbr');


// A convenience when we need a non displayed element
export const NODISPLAY =
    <Attrs = React.AllHTMLAttributes<HTMLDivElement> & React.Attributes>(attrs = {} as Attrs, ...children: React.ReactNode[]) =>
        DIV(Object.assign({}, attrs, { style: { display: 'none' } }), ...children);
