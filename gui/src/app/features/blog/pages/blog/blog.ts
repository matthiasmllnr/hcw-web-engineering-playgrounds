import { Component } from '@angular/core';
import { NzResultModule } from 'ng-zorro-antd/result';

@Component({
  selector: 'app-blog',
  imports: [NzResultModule],
  templateUrl: './blog.html',
  styleUrl: './blog.scss',
})
export class Blog {}
