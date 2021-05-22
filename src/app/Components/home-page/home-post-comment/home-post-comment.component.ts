import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { HPostCommentService } from '../HomeServices/hpost-comment.service';

@Component({
  selector: 'app-home-post-comment',
  templateUrl: './home-post-comment.component.html',
  styleUrls: ['./home-post-comment.component.scss']
})
export class HomePostCommentComponent implements OnInit {
  @Input() PostID: string
  @Input() admins
  @Input() AUTHId: string
  subscriptions: Subscription[] = []
  getComments = []
  
  userID

  turnOff: boolean = false
  counter: number = 0
  constructor( public commentService:HPostCommentService) { }
  identify(index, c) {
    return c.id
  }
  ngOnInit(): void {

    this.userID = localStorage.getItem('uid')
    let sub = this.commentService.getPostComments2(this.PostID).subscribe(res => {
      this.getComments = res.map(e => {
        return {
          id: e.payload.doc.id,
          ...(e.payload.doc.data() as object),
          doc: e.payload.doc
        }
      })
      this.hideBtn(res);
    })
    this.subscriptions.push(sub)
  }


  hideBtn(res) {
    if ((res.length % 5 != 0 && res.length - this.counter == 0) || res.length % 5 != 0 || res.length == 0) {
      this.turnOff = true
    } else {
      this.turnOff = false
    }
  }


}
