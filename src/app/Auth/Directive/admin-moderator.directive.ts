import { Directive, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from '../CookiesConfig/AuthService';

@Directive({
  selector: '[appAdminModerator]',
  standalone: true
})
export class AdminModeratorDirective {

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
    
    if (userRole === 1 || userRole === 2) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
