import { Component, ComponentInterface, Element, Event, EventEmitter, Prop, State } from '@stencil/core';

import { Color, Mode, RouterDirection } from '../../interface';
import { createColorClasses, hostContext, openURL } from '../../utils/theme';

@Component({
  tag: 'ion-fab-button',
  styleUrls: {
    ios: 'fab-button.ios.scss',
    md: 'fab-button.md.scss'
  },
  shadow: true
})
export class FabButton implements ComponentInterface {
  @Element() el!: HTMLElement;

  @State() keyFocus = false;

  @Prop({ context: 'window' }) win!: Window;

  /**
   * The mode determines which platform styles to use.
   */
  @Prop() mode!: Mode;

  /**
   * The color to use from your application's color palette.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   * For more information on colors, see [theming](/docs/theming/basics).
   */
  @Prop() color?: Color;

  /**
   * If `true`, the fab button will be show a close icon.
   */
  @Prop() activated = false;

  /**
   * If `true`, the user cannot interact with the fab button.
   */
  @Prop() disabled = false;

  /**
   * Contains a URL or a URL fragment that the hyperlink points to.
   * If this property is set, an anchor tag will be rendered.
   */
  @Prop() href?: string;

  /**
   * When using a router, it specifies the transition direction when navigating to
   * another page using `href`.
   */
  @Prop() routerDirection: RouterDirection = 'forward';

  /**
   * If `true`, the fab button will show when in a fab-list.
   */
  @Prop() show = false;

  /**
   * If `true`, the fab button will be translucent.
   */
  @Prop() translucent = false;

  /**
   * The type of the button.
   */
  @Prop() type: 'submit' | 'reset' | 'button' = 'button';

  /**
   * Emitted when the button has focus.
   */
  @Event() ionFocus!: EventEmitter<void>;

  /**
   * Emitted when the button loses focus.
   */
  @Event() ionBlur!: EventEmitter<void>;

  private onFocus = () => {
    this.ionFocus.emit();
  }

  private onKeyUp = () => {
    this.keyFocus = true;
  }

  private onBlur = () => {
    this.keyFocus = false;
    this.ionBlur.emit();
  }

  hostData() {
    const inList = hostContext('ion-fab-list', this.el);
    return {
      'ion-activatable': true,
      'aria-disabled': this.disabled ? 'true' : null,
      class: {
        ...createColorClasses(this.color),
        'fab-button-in-list': inList,
        'fab-button-translucent-in-list': inList && this.translucent,
        'fab-button-close-active': this.activated,
        'fab-button-show': this.show,
        'fab-button-disabled': this.disabled,
        'fab-button-translucent': this.translucent,
        'focused': this.keyFocus
      }
    };
  }

  render() {
    const TagType = this.href === undefined ? 'button' : 'a';
    const attrs = (TagType === 'button')
      ? { type: this.type }
      : { href: this.href };

    return (
      <TagType
        {...attrs}
        class="button-native"
        disabled={this.disabled}
        onFocus={this.onFocus}
        onKeyUp={this.onKeyUp}
        onBlur={this.onBlur}
        onClick={(ev: Event) => openURL(this.win, this.href, ev, this.routerDirection)}
      >
        <span class="close-icon">
          <ion-icon name="close" lazy={false}></ion-icon>
        </span>
        <span class="button-inner">
          <slot></slot>
        </span>
        {this.mode === 'md' && <ion-ripple-effect></ion-ripple-effect>}
      </TagType>
    );
  }
}
