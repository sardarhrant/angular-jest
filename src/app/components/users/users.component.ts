import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { PlaceholderService } from 'src/services/placeholder-service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  constructor(
    private placeholderservice: PlaceholderService,
    private cd: ChangeDetectorRef,
    private sanitizer: DomSanitizer
  ) {}

  users: any;
  responseServer: any;
  searchTerm!: string;

  ngOnInit() {
    this.placeholderservice.getUsers().subscribe(this.getUsers);
  }

  sanitizeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  private getUsers = (data: any) => {
    this.responseServer = data;
    this.users = this.responseServer.users;
  };

  searchUser(ev: any) {
    this.searchTerm = ev.target.value;
    console.log(this.responseServer.users);

    if (this.searchTerm && this.searchTerm.length) {
      this.users = this.responseServer.users.filter(
        (el: any) =>
          el.firstName.toLowerCase().indexOf(this.searchTerm.toLowerCase()) !==
          -1
      );
    } else {
      this.users = this.responseServer.users;
    }
  }
}
