import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzTypographyModule } from 'ng-zorro-antd/typography';

interface CommentItem {
  name: string;
  text: string;
}

@Component({
  selector: 'app-comments-section',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzButtonModule,
    NzFormModule,
    NzInputModule,
    NzListModule,
    NzTypographyModule,
  ],
  templateUrl: './comments-section.html',
  styleUrl: './comments-section.scss',
})
export class CommentsSection {
  // =========================
  // Declarations
  // =========================

  protected fb = inject(FormBuilder);

  protected isExpanded = false;

  // =========================
  // Form
  // =========================

  protected commentForm = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    comment: ['', [Validators.required, Validators.maxLength(500)]],
  });

  protected comments: CommentItem[] = [
    {
      name: 'Bob Fossil',
      text: 'Oh I am so glad you taught me all about the big brown angry guys...',
    },
  ];

  protected toggleExpanded(): void {
    this.isExpanded = !this.isExpanded;
  }

  protected get toggleLabel(): string {
    return this.isExpanded ? 'Hide comments' : 'Show comments';
  }

  protected onSubmit(): void {
    if (this.commentForm.invalid) return;

    const { name, comment } = this.commentForm.value;
    this.comments.push({
      name: name ?? '',
      text: comment ?? '',
    });

    this.commentForm.reset();
  }
}
