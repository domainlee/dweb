<?php
$paginator = $this->paginator;
$paginator->setItemCountPerPage($this->uriParams()->getRequest()->getQuery('icpp') ? : 12);

$this->headTitle($this->escapeHtml($this->translate('Danh sách tin tức')));
$this->headMeta()->appendName('description', ('Danh sách tin tức'));
$this->headMeta()->appendName('keywords', ('Danh sách tin tức'));
$this->headMeta()->appendProperty('og:title', 'Danh sách tin tức');

$cs = [
    '/tp/A013/css/n.css'
];
echo '<link href="'.srcLink($cs,1).'" media="screen" rel="stylesheet" type="text/css">';
$optionPage = $this->home()->optionPage();

?>
    <section class="lazy hero-news" data-src="https://ir.vinhomes.vn/dizi/themes/vinhome/assets/images/banner-quan-he-co-dong.jpg">
        <h1 class="title-page">Tin tức</h1>
    </section>

    <div class="page-news">
        <div class="container">
            <div class="row">
                <div class="col-md-12">
                    <?php
                    if(count($paginator)){
                        $n = $this->newsCategory()->getCategories();
                        if(count($n)){
                            echo '<ul class="navNews">';
                            foreach($n as $b){
                                echo '<li><a href="'.$b->getViewLink().'">'.$b->getName().'</a></li>';
                            }
                            echo '</ul>';
                        }
                        ?>

                        <div class="post-last__list post-last__list--category">
                            <?php
                            foreach($paginator as $n):
                                $extraContent = json_decode($n->getExtracontent(), true);

                                $image = json_decode($n->getImage(), true);
                                $imageFirst = '';
                                if(!empty($image)){
                                    $imageFirst = array_shift($image);
                                }
                                ?>
                                <div class="post-last__item">
                                    <div class="post-last__item--inner">
                                        <div class="">
                                            <a href="<?= $n->getViewLink(); ?>">
                                                <figure class="post-last__image lazy" data-src="<?= $imageFirst ?>"></figure>
                                            </a>
                                        </div>
                                        <div class="post-last__content">
                                            <h3 class="post-last__title"><a href="<?= $n->getViewLink() ?>"><?= $n->getTitle() ?></a></h3>
                                            <div class="post-last__intro"><?= $n->getDescription() ?></div>
                                        </div>
                                    </div>
                                </div>
                            <?php endforeach; ?>
                        </div>

                        <?php
                        echo '<div class="category__paginator">';
                        echo $this->paginationControl($this->paginator, 'Elastic', 'partial/listPage');
                        echo '</div>';
                    }
                    ?>
                </div>
            </div>
        </div>
    </div>

<?php if(!empty($optionPage['tieu-de-email'])): ?>
    <section class="form form__pdt">
        <div class="container">
            <div class="row">
                <div class="col-md-12">
                    <div class="form__inner">
                        <h2 class="headline-default"><?= $optionPage['tieu-de-email'] ? $optionPage['tieu-de-email']:'Email' ?></h2>
                        <?= $optionPage['mo-ta-email'] ? '<div class="four-post__intro"><span>'.$optionPage['mo-ta-email'].'</span></div>':'' ?>
                        <form class="form__register" data-parsley-validate novalidate>
                            <div>
                                <input class="email" type="text" data-parsley-type="email" required="required" data-parsley-error-message="Email không được để trống" placeholder="Email *" />
                            </div>
                            <div>
                                <input class="phone" type="text" data-parsley-type="digits" data-parsley-length="[10,11]" required="required" data-parsley-error-message="Số điện thoại không được để trống" placeholder="Số điện thoại *" />
                            </div>
                            <div>
                                <button type="submit">Gửi</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </section>
<?php endif; ?>