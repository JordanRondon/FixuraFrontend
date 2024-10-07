import { Directive, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from '../CookiesConfig/AuthService';

@Directive({
  selector: '[appCommonUser]',
  standalone: true
})
export class CommonUserDirective {

  constructor(
    private authService: AuthService,
    private templateRef: TemplateRef<any>, 
    private viewContainer: ViewContainerRef
  ) { }

  ngOnInit() {
    this.showOrHideElement();
  }

  private showOrHideElement() {
    const userRole = Number(this.authService.getToken_Id_rol());
    
    if (userRole === 3) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
