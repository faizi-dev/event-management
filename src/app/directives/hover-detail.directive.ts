import { Directive, HostListener, Input, Renderer2, ElementRef } from '@angular/core';

@Directive({
  selector: '[appHoverDetail]',
  standalone: true
})
export class HoverDetailDirective {

  @Input('appHoverDetail') eventDetails!: string; // Accepts event details as input
  private tooltip!: HTMLElement;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) { }

  @HostListener('mouseenter') onMouseEnter() {
    this.showTooltip();
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.hideTooltip();
  }

  private showTooltip() {
    if (!this.eventDetails) return;

    // Create tooltip element
    this.tooltip = this.renderer.createElement('div');
    this.renderer.addClass(this.tooltip, 'tooltip');
    this.renderer.setStyle(this.tooltip, 'position', 'absolute');
    this.renderer.setStyle(this.tooltip, 'background', '#333');
    this.renderer.setStyle(this.tooltip, 'color', '#fff');
    this.renderer.setStyle(this.tooltip, 'padding', '5px 10px');
    this.renderer.setStyle(this.tooltip, 'borderRadius', '5px');
    this.renderer.setStyle(this.tooltip, 'fontSize', '12px');
    this.renderer.setStyle(this.tooltip, 'zIndex', '1000');

    const text = this.renderer.createText(this.eventDetails);
    this.renderer.appendChild(this.tooltip, text);

    // Append tooltip to the body
    this.renderer.appendChild(document.body, this.tooltip);

    // Position tooltip near the element
    const rect = this.el.nativeElement.getBoundingClientRect();
    this.renderer.setStyle(this.tooltip, 'top', `${rect.top - 30}px`);
    this.renderer.setStyle(this.tooltip, 'left', `${rect.left}px`);
  }

  private hideTooltip() {
    if (this.tooltip) {
      this.renderer.removeChild(document.body, this.tooltip);
      this.tooltip = null!;
    }
  }

}
