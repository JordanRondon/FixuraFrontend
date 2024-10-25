import { Component, Input, OnInit } from '@angular/core';
import { UsuarioBlock } from '../../../Model/UsuarioBlock';
import { AdminModeratorDirective } from '../../../Auth/Directive/admin-moderator.directive';

@Component({
  selector: 'app-block-users',
  standalone: true,
  imports: [
    AdminModeratorDirective
  ],
  templateUrl: './block-users.component.html',
  styleUrl: './block-users.component.css'
})
export class BlockUsersComponent implements OnInit{

  @Input() usuario : UsuarioBlock | undefined;


  ngOnInit(): void {
    if(this.usuario){
      
    }
  }

}
