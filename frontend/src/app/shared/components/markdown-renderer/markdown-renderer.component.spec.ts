import { MarkdownRendererComponent } from './markdown-renderer.component';
import { MockBuilder, MockRender, ngMocks } from 'ng-mocks';
import { MarkdownModule } from 'ngx-markdown';

describe('MarkdownRendererComponent', () => {
  beforeEach(() => {
    ngMocks.flushTestBed();
    return MockBuilder(MarkdownRendererComponent)
      .mock(MarkdownModule);
  });

  it('should create', () => {
    const fixture = MockRender(MarkdownRendererComponent);
    expect(fixture.point.componentInstance).toBeTruthy();
  });

  it('should receive data input', () => {
    const fixture = MockRender(MarkdownRendererComponent, { data: '# Test' });
    expect(fixture.point.componentInstance.data).toBe('# Test');
  });
});
