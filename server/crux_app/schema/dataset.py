from django.contrib.auth import get_user_model
import graphene
from graphene_django import DjangoObjectType
from graphql_extensions.auth.decorators import (login_required,
                                                staff_member_required)

from .file import FileType, FileUploadType
from ..models import Dataset, File


class DatasetType(DjangoObjectType):
    class Meta:
        model = Dataset


class DatasetQuery(graphene.ObjectType):
    all_datasets = graphene.List(DatasetType)
    user_datasets = graphene.List(DatasetType)
    dataset_by_slug = graphene.Field(DatasetType, slug=graphene.String())

    def resolve_all_datasets(self, info, **kwargs):
        return Dataset.objects.all()

    def resolve_user_datasets(self, info, **kwargs):
        if info.context.user.is_anonymous:
            return None
        return info.context.user.dataset_set.all()

    def resolve_dataset_by_slug(self, info, slug, **kwargs):
        return Dataset.objects.get(slug=slug)


class CreateDataset(graphene.Mutation):
    success = graphene.Boolean()

    class Arguments:
        name = graphene.String(required=True)
        description = graphene.String()
        files = FileUploadType()

    @login_required
    def mutate(self, info, name, description, **kwargs):
        up_files = []

        dataset = Dataset(
            name=name,
            owner=info.context.user,
            **kwargs
        )
        dataset.save()
        for f in info.context.FILES.getlist('files'):
            file = File(
                file=f,
                file_type='DS',
                ** kwargs
            )
            file.save()
            dataset.files.add(file)

        return CreateDataset(dataset)


class DatasetMutation(graphene.ObjectType):
    create_dataset = CreateDataset.Field()
