import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { IHomeComment } from '../ViewModel/ihome-comment'

@Injectable({
  providedIn: 'root'
})
export class HPostCommentService {
  postCounts: BehaviorSubject<number>
  constructor( private db: AngularFirestore) {
    this.postCounts = new BehaviorSubject<number>(4)
   }

   writeComment(comment:IHomeComment, postId,AUTHId) {
    let uid = localStorage.getItem('uid');
    return new Promise<any>((res, rej) => {
      this.db.collection('users-details').doc(uid)
      .collection('MyFriendsPosts').doc(postId).collection('postsComments').add(comment)
      .then((res) => {
        console.log(res.id)
        this.db.collection('users-details').doc(AUTHId)
        .collection('MyPosts').doc(postId).collection('postsComments').doc(res.id).set(comment)
       }, (err) => rej(err))
    });
  }

  getPostComments2(postId, param?) {
    let uid = localStorage.getItem('uid');
    if (param != undefined) {
      return  this.db.collection('users-details').doc(uid)
      .collection('MyPosts').doc(postId).collection('postsComments', ref => ref.orderBy('CommentDate', 'desc').limit(5)
      .startAfter(param)).snapshotChanges();
    
    } else {
      return   this.db.collection('users-details').doc(uid)
      .collection('MyPosts').doc(postId).collection('postsComments', ref => ref.orderBy('CommentDate', 'desc').limit(5)).snapshotChanges();
     
    
      
    }
  }

  getFriendPostComments(postId, param?) {
    let uid = localStorage.getItem('uid');
    if (param != undefined) {
     return   this.db.collection('users-details').doc(uid)
      .collection('MyFriendsPosts').doc(postId).collection('postsComments', ref => ref.orderBy('CommentDate', 'desc').limit(5).startAfter(param)).snapshotChanges();
     
    } else {
     
      return this.db.collection('users-details').doc(uid)
      .collection('MyFriendsPosts').doc(postId).collection('postsComments', ref => ref.orderBy('CommentDate', 'desc').limit(5)).snapshotChanges();
     
       
    }
  }

  getMore() {
    this.postCounts.next(this.postCounts.value + 4)
  }

}
